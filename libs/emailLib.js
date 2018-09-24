'use strict';

const nodemailer = require('nodemailer');


let sendEmail = (sendEmailOptions) => {

    let account = {
        user: '*********',
        pass: '****' 
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: account.user, 
            pass: account.pass 
        }
    });

    let mailOptions = {
        from: '"Meeting Planner " ashishmangukiya97@gmail.com',
        to: sendEmailOptions.email, // list of receivers
        subject: sendEmailOptions.subject, // Subject line
        text: `Dear ${sendEmailOptions.name}`,
        html: sendEmailOptions.html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        else{
            console.log('Message successfully sent.', info);
        }
       
    });

}

module.exports = {
    sendEmail: sendEmail
  }
