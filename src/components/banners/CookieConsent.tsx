import Cookies from 'js-cookie';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { MouseEvent, useEffect, useState } from 'react';
import style from '../../styles/Cookie.module.css';

const USER_CONSENT_COOKIE_KEY = 'cookie_consent_is_true';

const CookieConsent = () => {
  const [cookieConsentIsTrue, setCookieConsentIsTrue] = useState(true);
  const { t } = useTranslation('common');

  useEffect(() => {
    const consentIsTrue = Cookies.get(USER_CONSENT_COOKIE_KEY) === 'true';
    setCookieConsentIsTrue(consentIsTrue);
  }, []);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!cookieConsentIsTrue) {
      Cookies.set(USER_CONSENT_COOKIE_KEY, 'true');
      setCookieConsentIsTrue(true);
    }
  };

  if (cookieConsentIsTrue) {
    return null;
  }

  return (
    <section className={style.cookieMessage}>
      <div>
        <div className={style.cookieItems}>
          <div className="">
            <p className="">
              {t('privacy policy message')}{' '}
              <Link href="/about" className="text-sm underline hover:text-lightAccent">
                {t('privacy policy')}
              </Link>
              .
            </p>
          </div>
          <div className="">
            <button
              className="p-3 text-sm font-bold text-white uppercase bg-gray-700 whitespace-nowrap"
              onClick={onClick}
            >
              {t('Got it')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CookieConsent;
