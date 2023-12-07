/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { SearchContext, withSearch } from '@elastic/react-search-ui';
import { useTranslation } from 'next-i18next';
import { useContext, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaFileExport } from 'react-icons/fa6';
import BulkDownloadService from '../services/BulkDownloadService';
import { CustomSearchQuery } from '../types/Entities';
import Loader from './Loader';
import { formatedQuery } from './indicators/query/Query';

type DownloadModalProps = {
  filters?: any;
  searchTerm?: any;
};

const DownloadModal = ({ filters, searchTerm }: DownloadModalProps) => {
  const { t } = useTranslation('common');
  const { driver } = useContext(SearchContext);
  const [show, setShow] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');
  const [isLoading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { search_fields, operator, index } = driver.searchQuery as CustomSearchQuery;
  // @ts-ignore
  const fields = Object.keys(search_fields);

  async function handleDownload() {
    try {
      setLoading(true);
      const query: QueryDslQueryContainer = formatedQuery(searchTerm, fields, operator, filters);
      const response = await new BulkDownloadService().search(index, query);
      const { file } = response;
      console.log('download fim', file);
      const nextDownloadLink = `/api/download?fileName=${file}`;
      setDownloadLink(nextDownloadLink);
      handleShow();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        title={t('Export csv') || 'Export csv'}
        className="btn-header btn btn-outline-secondary d-flex align-items-center flex-gap-8"
        onClick={handleDownload}
      >
        <FaFileExport />
        {t('csv')}
      </button>
      {isLoading ? <Loader /> : ''}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t('Download')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <a href={downloadLink} target="_blank" rel="noreferrer">
            {t('Export csv')}
          </a>
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

export default withSearch(({ filters, searchTerm }) => ({
  filters,
  searchTerm,
}))(DownloadModal);
