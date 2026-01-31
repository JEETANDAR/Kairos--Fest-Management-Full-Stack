require('dotenv').config();
let client_ID, client_Secret, COOKIE_KEY_1, COOKIE_KEY_2, MongoURI, Razorpay_key, Razorpay_secret, domainName, encryptedSecretKey;

const ENV = process.env.NODE_ENV || 'dev';

// General Environmental Variables
client_ID = process.env.CLIENT_ID;
client_Secret = process.env.CLIENT_SECRET;
COOKIE_KEY_1 = process.env.COOKIE_KEY_1;
COOKIE_KEY_2 = process.env.COOKIE_KEY_2;

encryptedSecretKey = process.env.encryptedQR_SecretKey;

// Database
const databasesEnv = {
    production: process.env.MongoDB_URI,
    dev: process.env.MongoDB_URI_Dev,
    test: process.env.MongoDB_URI_Test,
};

MongoURI = databasesEnv[ENV];

// Payment Keys
const paymentKeysEnv = {
    production: {
        Razorpay_key: process.env.Razorpay_key,
        Razorpay_secret: process.env.Razorpay_secret
    },
    dev: {
        Razorpay_key: process.env.Razorpay_key_Dev,
        Razorpay_secret: process.env.Razorpay_secret_Dev,
    },
    test: {
        Razorpay_key: process.env.Razorpay_key_Dev,
        Razorpay_secret: process.env.Razorpay_secret_Dev,
    }
};

Razorpay_key = paymentKeysEnv[ENV].Razorpay_key;
Razorpay_secret = paymentKeysEnv[ENV].Razorpay_secret;

if (ENV === 'production') {
    domainName = ["https://kairos.spcpegasus.com", 'http://localhost:5173', 'http://192.168.2.244:3000']
} else {
    domainName = 'http://localhost:5173';
}

module.exports = {
    client_ID,
    client_Secret,
    COOKIE_KEY_1,
    COOKIE_KEY_2,
    MongoURI,
    Razorpay_key,
    Razorpay_secret,
    domainName,
    encryptedSecretKey,
};
