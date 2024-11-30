import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dropdownStyle from '../styles/Dropdown.module.css';

function Navbar() {
  const LANGUAGES = process.env.LANGUAGES?.split(',');
  const router = useRouter();
  const { t } = useTranslation('navbar');

  const changeTo = (lang: string) => lang;

  return (
    <nav className="navbar navbar-dark navbar-expand-lg bg-violet py-0">
      <div className="container-fluid d-flex">
        <div className="flex-nowrap d-flex align-items-end flex-justify-content-between">
          <Link href="/">
            <a className="navbar-brand">
              <picture className="navbar-logo">
                <img className="img-fluid brcris" src="/logos/logo-brcris-pb.png" alt="logo do brcris" />
              </picture>
            </a>
          </Link>
          <a className="navbar-brand" href="https://www.gov.br/ibict/pt-br" target="_blank" rel="noreferrer">
            <picture className="navbar-logo">
              <img className="img-fluid ibict" src="/logos/logo-ibict-pb-st.png" alt="logo do ibict" />
            </picture>
          </a>

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
        </div>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav me-auto mb-2 mb-lg-0"></div>

          <ul className="navbar-nav nav nav-tabs" role="tablist">
            <li className="nav-item me-5" role="presentation">
              <Link href="/">
                <a className="nav-link">{t('Home')}</a>
              </Link>
            </li>

            <li className="nav-item me-5" role="presentation">
              <Link href="/dashboards">
                <a className="nav-link">{t('Dashboards')}</a>
              </Link>
            </li>
            <li className="nav-item me-5" role="presentation">
              <div className={dropdownStyle.dropdown}>
                <div className={dropdownStyle.flexCenter}>
                  <a href="#" className="nav-link">
                    {t('Tools')}
                    <svg
                      height="20"
                      width="20"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      focusable="false"
                      className="css-tj5bde-Svg"
                    >
                      <path
                        fill="#fff"
                        d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
                      ></path>
                    </svg>
                  </a>
                </div>
                <div className={dropdownStyle.dropdownContent}>
                  <a href="http://carrot.ibict.br/frontend/#/workbench" target="_blank" rel="noopener noreferrer">
                    {t('Carrot2')}
                  </a>
                  <a
                    href="https://visao.ibict.br/visao2/viewGroupCategory/403"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('Vision')}
                  </a>
                </div>
              </div>
            </li>

            <li className="nav-item me-5" role="presentation">
              <Link href="/team">
                <a className="nav-link">{t('Team')}</a>
              </Link>
            </li>
            <li className="nav-item me-5" role="presentation">
              <Link href="/about">
                <a className="nav-link">{t('About')}</a>
              </Link>
            </li>
            <li className="nav-item me-5" role="presentation">
              <Link href="/contact">
                <a className="nav-link">{t('Contact')}</a>
              </Link>
            </li>
            <li className="nav-item me-5" role="presentation">
              <div className={dropdownStyle.dropdown}>
                <div className={dropdownStyle.flexCenter}>
                  <a href="#" className="nav-link">
                    {t(router.locale || 'en')}
                    <svg
                      height="20"
                      width="20"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      focusable="false"
                      className="css-tj5bde-Svg"
                    >
                      <path
                        fill="#fff"
                        d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
                      ></path>
                    </svg>
                  </a>
                </div>
                <div className={dropdownStyle.dropdownContent}>
                  {LANGUAGES?.map((lang) => (
                    <Link href="" locale={changeTo(lang)} key={lang}>
                      {t(lang)}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
