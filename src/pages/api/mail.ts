import nodemailer from 'nodemailer'

/* eslint-disable @typescript-eslint/no-explicit-any */
const proxy = async (req: any, res: any) => {
  console.log('enviando email', process.env.MAIL_PASSWORD)
  const MAILPORT = process.env.MAIL_PORT
  const MAILHOST = process.env.MAIL_HOST
  const MAILFROM = process.env.MAIL_FROM
  const PASSWORD = process.env.MAIL_PASSWORD
  const MAILTO = process.env.MAIL_TO

  if (!MAILHOST || !MAILFROM || !PASSWORD || !MAILTO) {
    // Trate o caso em que as variáveis de ambiente estão faltando ou são undefined
    console.error('Variáveis de ambiente faltando ou indefinidas')
    res.send('error')
    return
  }

  const transporter = nodemailer.createTransport({
    port: Number(MAILPORT),
    host: MAILHOST,
    auth: {
      user: MAILFROM,
      pass: PASSWORD,
    },
    secure: true,
  })

  const mailData = {
    from: MAILFROM,
    to: MAILTO,
    subject: `Message from ${req.body.name}`,
    text: req.body.message + ' | Sent from: ' + req.body.email,
    html: `<div>${req.body.message}</div> <p>Sent from: ${req.body.email}</p>`,
  }

  const mailResponse = await transporter.sendMail(mailData)
  res.json(mailResponse)
}

export default proxy
