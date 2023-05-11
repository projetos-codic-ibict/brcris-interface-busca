import 'bootstrap/dist/css/bootstrap.min.css' // Import bootstrap CSS
/* import { useRouter } from 'next/router' */
import { useTranslation } from 'next-i18next'
import contactForm from '../styles/ContactForm.module.css'
/* import Link from 'next/link' */
import { useState } from 'react'

function ContactForm() {
  /* const router = useRouter() */
  const { t } = useTranslation('contactForm')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  /* const [submitted, setSubmitted] = useState(false) */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (event: any) => {
    event.preventDefault()

    const data = {
      name,
      email,
      message,
    }
    console.log('Enviando contato', data)
  }

  return (
    <div className="card">
      <div className="card-body search-card">
        <div className={`${contactForm.contactUs} mb-3 mx-auto`}>
          <h5 className="text-center">{t('ContactUs')}</h5>
        </div>

        <form action="">
          <div className="col-sm-12">
            <input
              className="form-control seacrh-box"
              type="text"
              placeholder={`${t('Name')}`}
              required
              onChange={(event) => {
                setName(event.target.value)
              }}
            />
          </div>

          <div className="col-sm-12 my-3">
            <input
              className="form-control seacrh-box"
              type="email"
              placeholder={`${t('Email')}`}
              required
              onChange={(event) => {
                setEmail(event.target.value)
              }}
            />
          </div>

          <div className="col-sm-12">
            <input
              className="form-control seacrh-box"
              type="text"
              placeholder={`${t('Message')}`}
              required
              onChange={(event) => {
                setMessage(event.target.value)
              }}
            />
          </div>

          <div className="submit-btn col-sm-12 mt-2 d-flex justify-content-end">
            <button
              className="btn btn-light"
              type="submit"
              onChange={(event) => {
                handleSubmit(event)
              }}
            >
              {t('Submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactForm
