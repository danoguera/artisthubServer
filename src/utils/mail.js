const nodemailer = require('nodemailer');

module.exports = {
  transporter: nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: "artisthub",
      pass: "Artist#1",
    },
  }),
  welcome(name) {
    return {
      html: `
        <body>
          <h1>Artisthub App</h1>
          <h2>Welcome ${name}</h2>
        </body>
      `,
      text: `Artisthub App\nWelcome ${name}`,
    };
  },
  recovery(link) {
    return {
      html: `
        <body>
          <h1>Artisthub App</h1>
          <p>A request to reset your password has been made. 
          If you did not make this request, simply ignore this email. 
          If you did make this request just click the link below:</p>
          <p>${link}</p>
          <p>If the above URL does not work, try copying and pasting it into your browser. If you continue to experience problems please feel free to contact us.</p>
        </body>
      `,
      text: `Artisthub App\n PLease visit to reset your password:  ${link}`,
    };
  },

  verify(transporter) {
    transporter.verify(function(error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });
  }
}