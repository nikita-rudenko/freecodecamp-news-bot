const nodemailer = require('nodemailer')

exports.sendErrorByEmail = async (err) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'no-reply',
    to: process.env.EMAIL_ADDRESS,
    subject: 'I failed - freeCodecampBot',
    text: err.message
  };

  await transporter.sendMail(mailOptions);
}
