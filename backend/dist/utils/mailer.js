const nodemailer = require('nodemailer');
export const createTransporter = (service, user, pass) => {
    return nodemailer.createTransport({
        service,
        auth: {
            user,
            pass,
        },
    });
};
//# sourceMappingURL=mailer.js.map