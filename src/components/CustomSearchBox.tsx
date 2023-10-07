/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useContext } from 'react';
import AdvancedSearchBox from './AdvancedSearchBox';
import BasicSearchBox from './BasicSearchBox';
import CustomContext from './context/CustomContext';

export type CustomSearchBoxProps = {
  titleFieldName: string;
  itemLinkPrefix: string;
  indexName: string;
  updateOpetatorConfig: (operator: string) => void;
};

const CustomSearchBox = ({ titleFieldName, itemLinkPrefix, indexName, updateOpetatorConfig }: CustomSearchBoxProps) => {
  const { advanced, setAdvanced } = useContext(CustomContext);

  return advanced ? (
    //@ts-ignore
    <AdvancedSearchBox indexName={indexName} toogleAdvancedConfig={setAdvanced} />
  ) : (
    <BasicSearchBox
      titleFieldName={titleFieldName}
      itemLinkPrefix={itemLinkPrefix}
      updateOpetatorConfig={updateOpetatorConfig}
      indexName={indexName}
      toogleAdvancedConfig={setAdvanced}
    />
  );
};

export default CustomSearchBox;
