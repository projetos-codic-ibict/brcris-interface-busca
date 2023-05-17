import nodemailer from 'nodemailer'

/* eslint-disable @typescript-eslint/no-explicit-any */
const proxy = async (req: any, res: any) => {
  console.log('enviando email')
  const MAILPORT = process.env.MAIL_PORT
  const MAILHOST = process.env.MAIL_HOST
  const MAILSENDER = process.env.MAIL_SENDER
  const PASSWORD = process.env.MAIL_PASSWORD
  const MAILRECIPIENT = process.env.MAIL_RECIPIENT

  console.log('MAILPORT', MAILPORT)
  console.log('MAILHOST', MAILHOST)
  console.log('MAILSENDER', MAILSENDER)
  console.log('PASSWORD', PASSWORD)
  console.log('MAILRECIPIENT', MAILRECIPIENT)

  if (!MAILHOST || !MAILSENDER || !PASSWORD || !MAILRECIPIENT) {
    // Trate o caso em que as variáveis de ambiente estão faltando ou são undefined
    console.error('Variáveis de ambiente faltando ou indefinidas')
    res.status(400).send('error')
    return
  }

  const transporter = nodemailer.createTransport({
    port: Number(MAILPORT),
    host: MAILHOST,
    auth: {
      user: MAILSENDER,
      pass: PASSWORD,
    },
    secure: true,
  })

  const mailData = {
    from: MAILSENDER,
    to: MAILRECIPIENT,
    subject: `Message from ${req.body.name}`,
    text: req.body.message + ' | Sent from: ' + req.body.email,
    html: `<div>${req.body.message}</div> <p>Sent from: ${req.body.email}</p>`,
  }

  const mailResponse = await transporter.sendMail(mailData)
  res.json(mailResponse)
}

export default proxy
