import nodemailer from 'nodemailer'

/* eslint-disable @typescript-eslint/no-explicit-any */
const proxy = async (req: any, res: any) => {
  const PORTMAIL = process.env.PORTMAIL
  const HOSTMAIL = process.env.HOSTMAIL
  const EMAILFROM = process.env.EMAILFROM
  const PASSWORD2FA = process.env.PASSWORD2FA
  const EMAILTO = process.env.EMAILTO

  if (!HOSTMAIL || !EMAILFROM || !PASSWORD2FA || !EMAILTO) {
    // Trate o caso em que as variáveis de ambiente estão faltando ou são undefined
    console.error('Variáveis de ambiente faltando ou indefinidas')
    res.send('error')
    return
  }

  const transporter = nodemailer.createTransport({
    port: Number(PORTMAIL),
    host: HOSTMAIL,
    auth: {
      user: EMAILFROM,
      pass: PASSWORD2FA,
    },
    secure: true,
  })

  const mailData = {
    from: EMAILFROM,
    to: EMAILTO,
    subject: `Message from ${req.body.name}`,
    text: req.body.message + ' | Sent from: ' + req.body.email,
    html: `<div>${req.body.message}</div> <p>Sent from: ${req.body.email}</p>`,
  }

  const mailResponse = await transporter.sendMail(mailData)
  console.log('Message sent: %s', mailResponse)
  res.json(mailResponse)
}

export default proxy
