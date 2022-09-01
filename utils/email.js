const nodemailer = require("nodemailer");
// const dot = require(/"dotenv")
// new Email(user, url).sendWelcome();
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(newUser, url) {
    this.url = url;
    this.to = newUser.email;
    this.firstname = newUser.name.split(" ")[0];

    this.from = `Amol Verma <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        Service: "SendGrid",

        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
        // Activate in gmail "less secure app" option
      });
    } else {
      return nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "f3f1220c1b6680",
          pass: "ebd9533d59ba3a",
        },
        // Activate in gmail "less secure app" option
      });
    }
  }

  async send(template, subject) {
    //Send the actual email
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstname,
        url: this.url,
        subject,
      }
    );
    //2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText.fromString(html),
    };
    //3) Create a Transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("Welcome", "Welcome to the Natours Family");
  }
  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your Password reset token (valid for only 10 minutes )"
    );
  }
};
