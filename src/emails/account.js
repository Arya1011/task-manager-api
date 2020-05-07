//File which contains ode for sending email from a user account
const sgMail=require('@sendgrid/mail');



//Setting up the API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY); //Provides association with our account(we could have used a variable to hold value of API key but we use this approch of environment variables since this adds better security)

// sgMail.send({
//     to: 'aryamaan1011@gmail.com',
//     from:'aryamaan1011@gmail.com',
//     subject:'First email',
//     text:'Hope u read this'
// })

//Creating a function which we will later export to user.js

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({     //This is an asynchronous function call
        to:email,
        from: 'aryamaan1011@gmail.com',
        subject:'Thanks for joining in',
        text:`Welcome to the app, ${name}`
    })
}

const sendCancellationEmail=(email,name)=>{
   sgMail.send({
       to:email,
       from:'aryamaan1011@gmail.com',
       subject:'We are sorry for ending this',
       text:`Any specific reasons for cancelling the membership ${name}`
   })
}

//When exporting multiple fucntions we need to send an object
module.exports={
    sendWelcomeEmail,
    sendCancellationEmail
}
