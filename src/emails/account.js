const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEamil = (email, name) => {
    const msg = {
        to: email,
        from: "herrickinjilincity@gmail.com",
        subject: "Thanks for join!",
        text: `Welcome to the app ${name}!`
    };
    sgMail.send(msg);
};

const sendGoodbyEamil = (email, name) => {
    const msg = {
        to: email,
        from: "herrickinjilincity@gmail.com",
        subject: "Sorry to see you go",
        text: `Goodby ${name}. I hope to see you back sometime soon.`
    };
    sgMail.send(msg);
};

module.exports = {
    sendWelcomeEamil,
    sendGoodbyEamil
};
