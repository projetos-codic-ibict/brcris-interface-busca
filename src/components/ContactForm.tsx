import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css' // Import bootstrap CSS
/* import { useRouter } from 'next/router' */
import { useTranslation } from 'next-i18next'
import contactForm from '../styles/ContactForm.module.css'
/* import Link from 'next/link' */
import { useState } from 'react'
import MailService from '../services/MailService'
import { alertService } from '../services/AlertService'
import LoadingScreen from './LoadingScreen'

function ContactForm() {
  /* const router = useRouter() */
  const { t } = useTranslation('contact')

  const options = {
    autoClose: true,
    keepAfterRouteChange: false,
  }

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  // const [submitted, setSubmitted] = useState(false)
  const [isLoading, setLoading] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault()

    const data = {
      name,
      email,
      message,
    }

    setLoading(true)
    const response = await MailService(JSON.stringify(data))
    setLoading(false)

    if (response.status === 200) {
      setName('')
      setEmail('')
      setMessage('')
      alertService.success(t('Mail sent success'), options)
    } else {
      alertService.success(t('Mail sent error'), options)
    }
  }

  return (
    <div className="card">
      {isLoading ? <LoadingScreen /> : ''}
      <div className="card-body search-card">
        <div className={`${contactForm.contactUs} mb-3 mx-auto`}>
          <h5 className="text-center">{t('ContactUs')}</h5>
        </div>
        <form
          onSubmit={(event) => {
            handleSubmit(event)
          }}
        >
          <div className="col-sm-12">
            <input
              className="form-control seacrh-box"
              type="text"
              placeholder={`${t('Name')}`}
              required
              value={name}
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
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
              }}
            />
          </div>

          <div className="col-sm-12">
            <textarea
              className="form-control seacrh-box"
              rows={6}
              placeholder={`${t('Message')}`}
              required
              value={message}
              onChange={(event) => {
                setMessage(event.target.value)
              }}
            />
          </div>

          <div className="submit-btn col-sm-12 mt-2 d-flex justify-content-end">
            <button className="btn btn-light" type="submit">
              {t('Submit')}
            </button>
          </div>
        </form>
        A
      </div>
    </div>
  )
}

export default ContactForm
