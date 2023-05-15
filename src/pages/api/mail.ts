/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer'

const proxy = async (req: any, res: any) => {
  const EMAIL = process.env.EMAIL
  const PASSWORD = process.env.PASSWORD

  const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
    secure: true,
  })

  const mailData = {
    from: EMAIL,
    to: 'jesielsilva@ibict.br',
    subject: `Message from ${req.body.name}`,
    text: req.body.message + ' | Sent from: ' + req.body.email,
    html: `<div>${req.body.message}</div> <p>Sent from: ${req.body.email}</p>`,
  }

  const mailResponse = await transporter.sendMail(mailData)
  console.log('Message sent: %s', mailResponse)
  res.json(mailResponse)
}

export default proxy
