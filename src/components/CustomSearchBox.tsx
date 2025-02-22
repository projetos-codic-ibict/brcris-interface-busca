/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useContext } from 'react';
import AdvancedSearchBox from './AdvancedSearchBox';
import BasicSearchBox from './BasicSearchBox';
import CustomContext from './context/CustomContext';

export type CustomSearchBoxProps = {
  titleFieldName: string;
  itemLinkPrefix: string;
  indexName: string;
  fieldNames: string[];
  setSearchTerm: (searchTerm: string) => void;
  handleSelectIndex: (event: any) => void;
};

const CustomSearchBox = ({
  titleFieldName,
  itemLinkPrefix,
  indexName,
  fieldNames,
  setSearchTerm,
  handleSelectIndex,
}: CustomSearchBoxProps) => {
  const { advanced, setAdvanced } = useContext(CustomContext);

  return advanced ? (
    //@ts-ignore
    <AdvancedSearchBox indexName={indexName} fieldNames={fieldNames} toogleAdvancedConfig={setAdvanced} />
  ) : (
    <BasicSearchBox
      titleFieldName={titleFieldName}
      itemLinkPrefix={itemLinkPrefix}
      setSearchTerm={setSearchTerm}
      handleSelectIndex={handleSelectIndex}
      indexName={indexName}
      toogleAdvancedConfig={setAdvanced}
    />
  );
};

export default CustomSearchBox;
