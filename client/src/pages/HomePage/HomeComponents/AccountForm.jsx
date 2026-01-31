import React from 'react';
import GoogleButton from './GoogleButton'; // Importing the new GoogleButton component

const AccountForm = () => {
    return (
        <div id="account-form" className="register container mx-auto p-6 max-w-xl">
            <h1 className="text-4xl text-white mb-4 text-center font-[Verdana] sm:text-4xl text-[1.5rem]">
  REGISTRATION
</h1>

            {/* <h4 className="text-center text-white bg-red-500 p-2">Note* The Registration is in the Test Phase</h4>
            <h3 className="text-center text-white bg-red-500 p-2 mb-6">The Registration will be open from Tuesday i.e 25/03/2026</h3> */}
            {/* Google Button */}
            <div className="flex justify-center mb-4">
                <GoogleButton />
            </div>
        </div>
    );
};

export default AccountForm;
