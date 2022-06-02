const nodemailer = require('nodemailer');
const config = require('../Configuration/API.js');

const credentials = {
    host: "mx.dannington.systems",
    port: 587,
    secure: false,
    auth: {
        user: config.email.address,
        pass: config.email.password,
    },
};

module.exports = {
    /**
     * Send an email extremely easily
     *
     * @param recipient
     * @param subject
     * @param short
     * @param html
     * @returns {Promise<unknown>}
     */
    send: async (recipient, subject, short, html) => {
        return new Promise(async (resolve, reject) => {
            async function handle() {
                let transporter = nodemailer.createTransport(credentials);
                let info = transporter.sendMail({
                    from: `"MineRIP Network" <${config.email.address}>`,
                    to: recipient,
                    subject,
                    text: short,
                    html
                });
            }

            handle().catch(async error => {
                console.error(error);
                reject(error);
            }).then(async () => {
                resolve();
            });
        });
    }
};
