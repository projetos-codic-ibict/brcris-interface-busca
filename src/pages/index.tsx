import Navbar from '../components/Navbar'

export default function App() {
  // const [config, setConfig] = useState(configDefault)

  return (
    <>
      <Navbar />
      <div className="card  search-card">
        <div className="card-body">
          <h5 className="card-title">Pesquisa</h5>
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              Teste 1
            </li>
            <li className="nav-item" role="presentation">
              Teste 2
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <form action="/search">
                <input name="q" type="text" placeholder="busca" />
                <button>Pesquisar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
