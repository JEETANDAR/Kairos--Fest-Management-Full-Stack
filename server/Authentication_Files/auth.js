const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const { addUser, userRole } = require('../Data_Model/user.data');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const { client_ID, client_Secret, COOKIE_KEY_1, COOKIE_KEY_2, MongoURI, domainName } = require('../utils/environmentalVariables');

// Google Auth Config
const config = {
    CLIENT_ID: client_ID,
    CLIENT_SECRET: client_Secret,
    COOKIE_KEY_1: COOKIE_KEY_1,
    COOKIE_KEY_2: COOKIE_KEY_2,
    MONGO_URI: MongoURI, // Ensure this is set in your .env file
    DOMAIN_NAME: domainName,
};
// Google OAuth Strategy
const AuthOptions = {
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production'
        ? "https://kairos.spcpegasus.com/api/auth/google/callback"
        : "http://localhost:9000/api/auth/google/callback",
    scope: ["profile", "email"],  // ✅ Required scopes
};

passport.use(new Strategy(AuthOptions, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
}));

passport.serializeUser((user, done) => {
    const userPackage = {
        name: user.displayName || user._json.email.split('@')[0],
        collegeName: null,
        phoneNo: null,
        emailID: user._json.email,
        emailVerified: user._json.email_verified,
    };
    done(null, userPackage);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Initialize Session Middleware
function initializeAuth(app) {
    app.use(session({
        name: 'kairos.sid',
        secret: config.COOKIE_KEY_1 && config.COOKIE_KEY_2 ? [config.COOKIE_KEY_1, config.COOKIE_KEY_2] : 'default_secret_key', // Fallback in case env variables are missing
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: config.MONGO_URI,
            collectionName: 'sessions',
            ttl: 24 * 60 * 60, // 24 hours
        }),
        cookie: {
            path: '/',
            secure: false, // Secure only in production
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 hour
        },
    }));

    app.use(passport.initialize());
    app.use(passport.session());
}

// Authentication Routes
function setupAuthRoutes(app) {
    app.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/auth/failure' }),
        async (req, res) => {
            try {
                const hostDomainName = req.get('host');
                const hostProtocolUsed = req.get('x-forwarded-proto') || req.protocol;
                console.log("✅ Host Name:", hostDomainName);

                if (!req.user) {  // ✅ Fix: Ensure `req.user` exists
                    console.error("❌ Authentication failed: No user found.");
                    return res.redirect(`${hostProtocolUsed}://${hostDomainName}/failure?message=${encodeURIComponent("Authentication failed")}`);
                }

                if (!req.sessionID) {
                    throw new Error("❌ Session ID is null");
                }

                console.log("✅ User Authenticated:", req.user);
                const user = req.user
                const userInfo = {
                    userID: user.id,
                    emailID: user._json.email,
                    name: user.displayName || '',
                    emailVerified: user._json.email_verified,
                };
                console.log("User Infor before adding: ", userInfo);
                let userExist = await addUser(userInfo);
                console.log("New user: ", userExist)
                req.session.user = userExist;

                console.log("✅ Session stored successfully:", req.session);

                req.session.save((err) => {
                    if (err) {
                        console.error("❌ Session save error:", err);
                        if (process.env.NODE_ENV !== 'production') {
                            return res.redirect(`http://localhost:5173/failure?message=${encodeURIComponent("Error saving session")}`);
                        } else {
                            return res.redirect(`${hostProtocolUsed}://${hostDomainName}/failure?message=${encodeURIComponent("Error saving session")}`);
                        }
                    }

                    if (process.env.NODE_ENV !== 'production') {
                        res.redirect(`http://localhost:5173/dashboard`);
                    } else {
                        res.redirect(`${hostProtocolUsed}://${hostDomainName}/dashboard`);
                    }
                });

            } catch (err) {
                console.error("❌ Authentication error:", err);
                res.redirect(`${hostProtocolUsed}://${hostDomainName}/failure?message=${encodeURIComponent(err.message)}`);
            }
        }
    );


    // Handle authentication failure
    app.get('/auth/failure', (req, res) => {
        res.status(401).json({ success: false, message: "Google authentication failed" });
    });

    // Fetch user session data
    app.get('/auth/user', (req, res) => {
        res.header('Access-Control-Allow-Origin', config.DOMAIN_NAME);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Access-Control-Allow-Methods', 'GET, POST');

        console.log('Session Cookie: ', req.session);

        if (req.session && req.session.user) {
            return res.status(200).json({ success: true, user: req.session.user, expiresAt: Date.now() + 60 + 60 + 1000 });
        } else {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
    });



    app.get('/auth/logout', (req, res) => {
        if (!req.session) {
            return res.redirect('/');
        }

        req.logout((err) => {
            if (err) {
                console.error("Logout Error:", err);
                return res.status(500).json({ error: "Error during logout" });
            }

            req.session.destroy((err) => {
                if (err) return res.status(500).send('Failed to destroy session');
                res.clearCookie('kairos.sid');
                res.redirect('/');
            });
        });
    });
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.status(401).json('Unauthorized: Please log in');
}


const generalPermissions = ['coordinator', 'admin', 'facultyCoordinator'];

async function checkIfCoordinator(req, res, next) {
    try {
        // Ensure session and user object exist
        const emailID = req.session?.passport?.user?.emailID;
        if (!emailID) {
            console.log("Unauthorized: No user session found");
            return res.status(401).json('Unauthorized: No user session found');
        }

        console.log("Checking user:", emailID);

        // Fetch user role
        const retrievedUserInfo = await userRole(emailID);
        const userRoleString = retrievedUserInfo.userRole; // Adjust based on your DB response

        console.log("User Role:", userRoleString);
        console.log("Checking role inclusion:", generalPermissions.includes(userRoleString));

        // Check if role is in the allowed list
        if (generalPermissions.includes(userRoleString)) {
            return next();
        }

        return res.status(403).json('Forbidden: You do not have coordinator permissions');
    } catch (err) {
        console.error("Error while checking coordinator permission:", err);
        return res.status(500).json('Internal Server Error');
    }
}

const teacherPermission = generalPermissions.slice(-2);
async function checkIfTeacherCoordinator(req, res, next) {
    try {
        // Ensure session and user object exist
        const emailID = req.session?.passport?.user?.emailID;
        if (!emailID) {
            console.log("Unauthorized: No user session found");
            return res.status(401).json('Unauthorized: No user session found');
        }

        console.log("Checking user:", emailID);

        // Fetch user role
        const retrievedUserInfo = await userRole(emailID);
        const userRoleString = retrievedUserInfo.userRole; // Adjust based on your DB response

        console.log("User Role:", userRoleString);
        console.log("Checking role inclusion:", generalPermissions.includes(userRoleString));

        // Check if role is in the allowed list
        if (teacherPermission.includes(userRoleString)) {
            return next();
        }

        return res.status(403).json('Forbidden: You do not have coordinator permissions');
    } catch (err) {
        console.error("Error while checking coordinator permission:", err);
        return res.status(500).json('Internal Server Error');
    }
}

module.exports = { initializeAuth, setupAuthRoutes, ensureAuthenticated, checkIfCoordinator, checkIfTeacherCoordinator };
