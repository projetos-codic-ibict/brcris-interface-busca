/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useContext } from 'react';
import AdvancedSearchBox from './AdvancedSearchBox';
import BasicSearchBox from './BasicSearchBox';
import CustomContext from './context/CustomContext';

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
  const { advanced, setAdvanced } = useContext(CustomContext);

  return advanced ? (
    //@ts-ignore
    <AdvancedSearchBox indexName={indexLabel} fieldNames={fieldNames} toogleAdvancedConfig={setAdvanced} />
  ) : (
    <BasicSearchBox
      titleFieldName={titleFieldName}
      setSearchTerm={setSearchTerm}
      handleSelectIndex={handleSelectIndex}
      indexLabel={indexLabel}
      toogleAdvancedConfig={setAdvanced}
    />
  );
};

export default CustomSearchBox;
