import 'bootstrap/dist/css/bootstrap.min.css' // Import bootstrap CSS
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

function Navbar() {
  const router = useRouter()
  const { t } = useTranslation('navbar')

  const changeTo = router.locale === 'en' ? 'pt-BR' : 'en'

  return (
    <nav className="navbar navbar-expand-lg bg-violet px-5">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <Link href="/">
            <a className="navbar-brand">
              <picture className="navbar-logo">
                <img
                  className="img-fluid brcris"
                  src="/logos/logo-brcris-pb.png"
                  alt="logo do brcris"
                />
              </picture>
            </a>
          </Link>
          <Link href="/">
            <a className="navbar-brand">
              <picture className="navbar-logo">
                <img
                  className="img-fluid ibict"
                  src="/logos/logo-ibict-pb-st.png"
                  alt="logo do ibict"
                />
              </picture>
            </a>
          </Link>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav me-auto mb-2 mb-lg-0"></div>

          <ul className="navbar-nav nav nav-tabs me-2" role="tablist">
            <li className="nav-item me-5" role="presentation">
              <Link href="/">
                <a className="nav-link">{t('Home')}</a>
              </Link>
            </li>

            <li className="nav-item me-5" role="presentation">
              <Link href="/">
                <a className="nav-link">{t('Team')}</a>
              </Link>
            </li>

            <li className="nav-item me-5" role="presentation">
              <Link href="/about">
                <a className="nav-link">{t('About')}</a>
              </Link>
            </li>

            <li className="nav-item me-5" role="presentation">
              <Link href="#" locale={changeTo}>
                <picture className="">
                  <img
                    className="icon-lang"
                    src={`/${changeTo}.png`}
                    alt="bandeira do idioma"
                    title={t('change_language') || ''}
                  />
                </picture>
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item">
              <button className="navbar-btn btn-picti">PICTI</button>
            </li>

            <li className="nav-item">
              <button className="navbar-btn btn-api mx-2">API</button>
            </li>

            <li className="nav-item">
              <button className="navbar-btn btn-lorem">LOREM</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
