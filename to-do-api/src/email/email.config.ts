/**
 * This file provides configuration options for NodeMailer who's values
 * are pulled from the .env file in the root api folder. 
 */
import * as nodemailer from 'nodemailer';
import GetENV from '../getENV';

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

/*Options for the NodeMailer transporter object. These options must be
configured in the .env file with a valid email service. See ReadMe for
more information.*/
const transporterOptions = {
    service: GetENV('EMAIL_SERVICE'),
    host: GetENV('EMAIL_HOST'),
    port: Number(GetENV('EMAIL_PORT')),
    tls: GetENV('EMAIL_SERVICE') === 'outlook' ? { 
        ciphers: 'SSLv3'
    } : undefined,
    secure: Number(GetENV('EMAIL_HOST'))===465? true : false, 
    auth: {
        user: GetENV('EMAIL_USERNAME'),
        pass: GetENV('EMAIL_PASSWORD')
    }
}

/*Create a NodeMailer transporter object which is responsible for
sending the email message.*/
const transporter = nodemailer.createTransport(transporterOptions);

//Send an email using the NodeMailer transporter and specified options.
async function sendEmail(
    mailOptions: MailOptions, 
    callback: (info: any) => void
) {
    try {
        const info = await transporter.sendMail(mailOptions);
        callback(info);
    } catch (error) {
        console.log(error);
    }
};

export default sendEmail;