import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import styles from '../styles/AdvancedSearch.module.css';

const HelpModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <span onClick={handleShow} className={styles.help}>
        Precisa de ajuda?
      </span>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Glossário e ajuda para busca</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Você pode enriquecer sua busca de uma forma muito simples. Use os campos de pesquisa combinados com os
            conectores (AND, OR e AND NOT) e especifique cada vez mais sua busca.
          </p>
          <p>Por exemplo, se você deseja buscar publicaṍes sobre Java em 2018, use:</p>
          <p className="text-center">
            <code>(title_text:Java) AND (publicationDate:2018)</code>
          </p>
          <p>Veja abaixo a lista completa de campos de pesquisa que podem ser usados:</p>
          <table className="table">
            <thead>
              <tr>
                <th>Campo</th>
                <th>Elemento</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>all</td>
                <td>todos os campos</td>
              </tr>
              <tr>
                <td>title</td>
                <td>título do registro</td>
              </tr>
              <tr>
                <td>autor</td>
                <td>autor</td>
              </tr>
              <tr>
                <td>publicationDate</td>
                <td>data de publicação</td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HelpModal;
