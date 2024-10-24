import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAIL_TRAP_USER,
    pass: process.env.MAIL_TRAP_PASSWORD,
  },
});

const sendVerification = async (email: string, link: string) => {
  await transport.sendMail({
    from: "verification@myapp.com",
    to: email,
    html: `<h1> Bấm vào <a href = "${link}">link này</a> để xác thực tài khoản của bạn </h1>`,
  });
};

const sendPasswordResetLink = async (email: string, link: string) => {
  await transport.sendMail({
    from: "security@myapp.com",
    to: email,
    html: `<h1> Bấm vào <a href = "${link}">link này</a> để thay đổi mật khẩu của bạn </h1>`,
  });
};

const sendPasswordUpdateMessage = async (email: string) => {
  await transport.sendMail({
    from: "security@myapp.com",
    to: email,
    html: `<h1> Mật khẩu của bạn đã được thay đổi, bạn có thể sử dụng nó ngay bây giờ.</h1>`,
  });
};
const mail = {
  sendVerification,
  sendPasswordResetLink,
  sendPasswordUpdateMessage,
};

export default mail;
