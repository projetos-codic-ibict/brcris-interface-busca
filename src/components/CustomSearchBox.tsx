/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react';
import AdvancedSearchBox from './AdvancedSearchBox';
import BasicSearchBox from './BasicSearchBox';

import { useTranslation } from 'next-i18next';
import style from '../styles/Switch.module.css';

export type CustomSearchBoxProps = {
  titleFieldName: string;
  indexLabel: string;
  fieldNames: string[];
  setSearchTerm: (searchTerm: string) => void;
  handleSelectIndex: (event: any) => void;
};

const CustomSearchBox = ({
  titleFieldName,
  indexLabel,
  fieldNames,
  setSearchTerm,
  handleSelectIndex,
}: CustomSearchBoxProps) => {
  const { t } = useTranslation('common');
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <>
      <div className={style['br-switch']} role="presentation" style={{ marginBottom: '10px' }}>
        <input
          id="switch-default"
          type="checkbox"
          name="switch-default"
          checked={showAdvanced}
          role="switch"
          onChange={() => setShowAdvanced((prev) => !prev)}
        />
        <label htmlFor="switch-default">{t('Advanced search')}</label>
      </div>

      {showAdvanced ? (
        //@ts-ignore
        <AdvancedSearchBox indexName={indexLabel} fieldNames={fieldNames} />
      ) : (
        <BasicSearchBox
          titleFieldName={titleFieldName}
          setSearchTerm={setSearchTerm}
          handleSelectIndex={handleSelectIndex}
          indexLabel={indexLabel}
        />
      )}
    </>
  );
};

export default CustomSearchBox;
