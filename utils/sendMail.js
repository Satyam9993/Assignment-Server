require('dotenv').config();
const  nodeMailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

exports.sendMail = async(options) => {
    // Create a reusable transporter object using the default SMTP transport
    let transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const {
        email, subject, template, data
    } = options;

    // Specify the path to the EJS template
    const templatePath = path.resolve(__dirname, '../mails', template);
    
    // Render the EJS template
    const html = await ejs.renderFile(templatePath, data);

    // Setup email data with unicode symbols
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject, // Subject line
        html // html body
    };

    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
}