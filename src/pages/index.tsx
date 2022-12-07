import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'

export default function App() {
  // const [config, setConfig] = useState(configDefault)

  return (
    <div className={styles.home}>
      <Navbar />
      <div className={styles.textWhite}>
        <div className="container page">
          <div className="row">
            <div className="col-md-6"></div>
            <div className="col-md-6">
              <div className="card search-card">
                <div className="card-body">
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        data-bs-toggle="tab"
                        data-bs-target="#pub"
                        type="button"
                        role="tab"
                        aria-controls="pub"
                        aria-selected="true"
                      >
                        Publicações
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content" id="tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="pub"
                      role="tabpanel"
                      aria-labelledby="pub-tab"
                    >
                      <form className="row g-3" action="/search">
                        <div className="col-auto">
                          <input
                            className="form-control"
                            name="q"
                            type="text"
                            placeholder="Busca..."
                          />
                        </div>
                        <div className="col-auto">
                          <button className="btn btn-light mb-3">
                            Pesquisar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 mt-5">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
                  veritatis, earum distinctio nisi ipsa ea, corporis quas minus
                  placeat ducimus et, vero obcaecati labore explicabo fugit
                  illum amet eius ratione?
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
                  veritatis, earum distinctio nisi ipsa ea, corporis quas minus
                  placeat ducimus et, vero obcaecati labore explicabo fugit
                  illum amet eius ratione?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
