import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import styles from '../styles/AdvancedSearch.module.css';

type HelpModalProps = {
  fields: string[];
};

const HelpModal = ({ fields }: HelpModalProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <span onClick={handleShow} className={styles.help}>
        Precisa de ajuda?
      </span>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t('Glossary and search help')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {t(
              'You can enrich your search in a very simple way. Use the search indexes combined with the connectors (AND, OR or AND NOT) and specify more your search.'
            )}
          </p>
          <p>
            {t(
              'For example, if you want to search for publications on Computing in 2018, excluding master thesis: go to the '
            )}{' '}
            <Link href="/publications">{t('publications')}</Link> {t('index page and use the query below')}:
          </p>
          <p className="text-center">
            <code>{t('(all:Computing) AND (publicationDate:2018) AND NOT (type:master thesis)')}</code>
          </p>
          <hr />
          <p>
            {t('See below for the full list of search fields that can be used for the index of')}{' '}
            <b>{t(router.pathname.replaceAll('/', ''))}</b>.
          </p>
          <ul>
            <li>all *</li>
            {fields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
          <span>* {t('All fields')}</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('Close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HelpModal;
