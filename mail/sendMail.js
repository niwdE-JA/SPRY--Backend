var nodemailer = require('nodemailer');
var credentials = require('./credentials.js')



var mailTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    // port: 465,
    service:'gmail',
    // secure: true,
    auth: {
       user: credentials.user,
       pass:  credentials.password
    },
    // debug: false,
    // logger: true 

});

async function sendMail(email, subject, text){
    console.log('Sending to...', email, credentials.user, credentials.password);

    try {
        let info = await mailTransport.sendMail({
                        from : ' "SPRY" <dezwhy97@gmail.com>',
                        to : email,
                        subject,
                        text,
                    } );
            
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error( 'Unable to send email: ' + error );//is this enough?
    }
}

module.exports = sendMail;