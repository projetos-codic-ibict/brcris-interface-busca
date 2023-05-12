import nodemailer from 'nodemailer'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function transporter(req: any, res: any) {
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
    to: 'rafaelmaggot64@gmail.com',
    subject: `Message from ${req.body.name}`,
    text: req.body.message + ' | Sent from: ' + req.body.email,
    html: `<div>${req.body.message}</div> <p>Sent from: ${req.body.email}</p>`,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transporter.sendMail(mailData, function (err: any, info: any) {
    err ? console.error(err) : console.log(info)
  })

  res.status(200)

  console.log(req.body)
}
