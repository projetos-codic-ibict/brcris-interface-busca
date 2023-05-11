import 'bootstrap/dist/css/bootstrap.min.css' // Import bootstrap CSS
/* import { useRouter } from 'next/router' */
import { useTranslation } from 'next-i18next'
import contactForm from '../styles/ContactForm.module.css'
/* import Link from 'next/link' */

function ContactForm() {
  /* const router = useRouter() */
  const { t } = useTranslation('contactForm')

  return (
    <div className="card">
      <div className="card-body search-card">
        <div className={`${contactForm.contactUs} mb-3 mx-auto`}>
          <h5 className="text-center">{t('ContactUs')}</h5>
        </div>

        <form action="sendEmail()">
          <div className="col-sm-12">
            <input
              className="form-control seacrh-box"
              type="text"
              placeholder={`${t('Name')}`}
              required
            />
          </div>

          <div className="col-sm-12 my-3">
            <input
              className="form-control seacrh-box"
              type="email"
              placeholder={`${t('Email')}`}
              required
            />
          </div>

          <div className="col-sm-12">
            <input
              className="form-control seacrh-box"
              type="text"
              placeholder={`${t('Message')}`}
              required
            />
          </div>

          <div className="submit-btn col-sm-12 mt-2 d-flex justify-content-end">
            <button className="btn btn-light" type="submit">
              {t('Submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactForm
