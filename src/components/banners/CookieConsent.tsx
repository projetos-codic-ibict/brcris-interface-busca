import Link from 'next/link'
import Cookies from 'js-cookie'
import { MouseEvent, useEffect, useState } from 'react'
import style from '../../styles/Cookie.module.css'

const USER_CONSENT_COOKIE_KEY = 'cookie_consent_is_true'
const USER_CONSENT_COOKIE_EXPIRE_DATE =
  new Date().getTime() + 365 * 24 * 60 * 60

const CookieConsent = () => {
  const [cookieConsentIsTrue, setCookieConsentIsTrue] = useState(true)

  useEffect(() => {
    const consentIsTrue = Cookies.get(USER_CONSENT_COOKIE_KEY) === 'true'
    setCookieConsentIsTrue(consentIsTrue)
  }, [])

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!cookieConsentIsTrue) {
      Cookies.set(USER_CONSENT_COOKIE_KEY, 'true', {
        expires: USER_CONSENT_COOKIE_EXPIRE_DATE,
      })
      setCookieConsentIsTrue(true)
    }
  }

  if (cookieConsentIsTrue) {
    return null
  }

  return (
    <section className={style.cookieMessage}>
      <div>
        <div className={style.cookieItems}>
          <div className="">
            <p className="">
              This site uses services that uses cookies to deliver better
              experience and analyze traffic. You can learn more about the
              services we use at our{' '}
              <Link href="/privacy-policy">
                <a className="text-sm underline hover:text-lightAccent">
                  privacy policy
                </a>
              </Link>
              .
            </p>
          </div>
          <div className="">
            <button
              className="p-3 text-sm font-bold text-white uppercase bg-gray-700 whitespace-nowrap"
              onClick={onClick}
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CookieConsent
