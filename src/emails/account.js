const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, password, name) => {
    sgMail.send({
        to: email,
        from: 'subroto.sks@gmail.com',
        subject: 'Singularity Newspaper Editor Recruitment',
        text: `Welcome to the Singularity, ${name}. Your Username: ${email} and Password: ${password} \nWe will let you know when your account is active. \n\nThank You`
    })
}

const sendActivationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'subroto.sks@gmail.com',
        subject: 'Singularity Newspaper Editor Account Activation',
        text: `Hello, ${name}. Your account is active. Now you can login. \n\nThank you.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendActivationEmail
}