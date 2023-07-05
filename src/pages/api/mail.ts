/* eslint-disable @typescript-eslint/ban-ts-comment */
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';

type BodyType = {
  name: string;
  email: string;
  message: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const proxy = async (req: any, res: any) => {
  const { body } = req;

  if (body.name === '' || body.email === '' || body.message === '' || body.captcha === '') {
    res.status(400).json({ message: 'os campos obrigatórios não foram preenchidos' });
  }

  // Extract the email and captcha code from the request body
  const { captcha } = body;

  try {
    // Ping the google recaptcha verify API to verify the captcha code you received
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        method: 'POST',
      }
    );
    const captchaValidation = await response.json();
    // @ts-ignore
    if (captchaValidation.success) {
      // Replace this with the API that will save the data received
      await sendMail(req.body);
      // Return 200 if everything is successful
      return res.status(200).send('OK');
    }

    return res.status(422).json({
      message: 'Unproccesable request, Invalid captcha code',
    });
  } catch (error) {
    console.error(error);
    return res.status(422).json({ message: 'Something went wrong' });
  }
};

async function sendMail(body: BodyType) {
  console.log('enviando email');
  const MAILPORT = process.env.MAIL_PORT;
  const MAILHOST = process.env.MAIL_HOST;
  const MAILSENDER = process.env.MAIL_SENDER;
  const PASSWORD = process.env.MAIL_PASSWORD;
  const MAILRECIPIENT = process.env.MAIL_RECIPIENT;

  if (!MAILPORT || !MAILHOST || !MAILSENDER || !PASSWORD || !MAILRECIPIENT) {
    console.error('Variáveis de ambiente faltando ou indefinidas');
    throw new Error('Variáveis de ambiente faltando ou indefinidas');
  }

  const transporter = nodemailer.createTransport({
    port: Number(MAILPORT),
    host: MAILHOST,
    auth: {
      user: MAILSENDER,
      pass: PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // quando resolver o problema de DNS remover esta configuração
    },
    logger: true,
    debug: true,
    // secure: true,
  });

  const mailData = {
    from: MAILSENDER,
    to: MAILRECIPIENT,
    subject: `Message from ${body.name}`,
    text: body.message + ' | Sent from: ' + body.email,
    html: `<div>${body.message}</div> <p>Sent from: ${body.email}</p>`,
  };

  const mailResponse = await transporter.sendMail(mailData);
  return mailResponse;
}

export default proxy;
