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
          <h1>Artist Hub App</h1>
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

  paymentMail(fare,title,description,clientName,clientEmail,message,refPayment,eventDate) {
    return {
      html: `
        <body>
          <h1>${title}</h1>
          <p>A payment for one of your services has been received for an amount of $ ${fare}.</p>
          <p>Description of your service:</p>
          ${description}
          <p>The information about the client is:</p>
          <p>${clientName}</p>
          <p>${clientEmail}</p>
          <p>The dates of your client&rsquo;s event are: ${eventDate}</p>
          <p>Message from your client: ${message}</p> 
          <p>Payment Reference: ${refPayment}</p>
          <p>Thank you!</p>
          <p>ArtistHub</p>
        </body>
      `,
    };
  },

  contactMail(title,description,clientName,clientEmail,message) {
    return {
      html: `
        <body>
          <h1>${title}</h1>
          <p>An user has commented on your post:</p>
          <p>${description}</p>
          <p>The information about the client is:</p>
          <p>${clientName}</p>
          <p>${clientEmail}</p>
          <p>The message from your client is: ${message}</p>
          <p>Thank you!</p>
          <p>ArtistHub</p>
        </body>
      `,
    };
  },

  paymentMailUser(fare,title,description,providerName,providerEmail) {
    return {
      html: `
        <body>
          <h1>${title}</h1>
          <p>This is a message confirming you have paid $${fare} for the following service at Artist Hub:</p>
          ${description}
          <p>The information about the service provider is:</p>
          <p>${providerName}</p>
          <p>${providerEmail}</p>
          <p>Thank you!</p>
          <p>ArtistHub</p>
        </body>
      `,
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