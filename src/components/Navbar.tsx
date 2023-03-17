import 'bootstrap/dist/css/bootstrap.min.css' // Import bootstrap CSS
// import styles from '../styles/Home.module.css'
import Link from 'next/link'

function Navbar() {
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
                <a className="nav-link">Home</a>
              </Link>
            </li>

            <li className="nav-item me-5" role="presentation">
              <Link href="/">
                <a className="nav-link">Indicator Panels</a>
              </Link>
            </li>

            <li className="nav-item me-5" role="presentation">
              <Link href="/">
                <a className="nav-link">Team</a>
              </Link>
            </li>

            <li className="nav-item me-5" role="presentation">
              <Link href="/">
                <a className="nav-link">About</a>
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
