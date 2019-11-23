import nodemailer from 'nodemailer';

export const sendEmail = async config => {
  let account = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });

  const info = await transporter.sendMail({
    from: 'info@interswitch.com',
    ...config
  });

  return `Preview URL: %s', ${nodemailer.getTestMessageUrl(info)}`;
};
