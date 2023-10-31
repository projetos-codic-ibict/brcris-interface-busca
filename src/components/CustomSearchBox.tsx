/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useContext } from 'react';
import BasicSearchBox from './BasicSearchBox';
import CustomContext from './context/CustomContext';

export type CustomSearchBoxProps = {
  titleFieldName: string;
  itemLinkPrefix: string;
  indexName: string;
  fieldNames: string[];
  updateOpetatorConfig: (operator: string) => void;
};

const CustomSearchBox = ({
  titleFieldName,
  itemLinkPrefix,
  indexName,
  fieldNames,
  updateOpetatorConfig,
}: CustomSearchBoxProps) => {
  const { advanced, setAdvanced } = useContext(CustomContext);

  return (
    <BasicSearchBox
      titleFieldName={titleFieldName}
      itemLinkPrefix={itemLinkPrefix}
      updateOpetatorConfig={updateOpetatorConfig}
      indexName={indexName}
      toogleAdvancedConfig={setAdvanced}
    />
  );

  // return advanced ? (
  //   //@ts-ignore
  //   <AdvancedSearchBox indexName={indexName} fieldNames={fieldNames} toogleAdvancedConfig={setAdvanced} />
  // ) : (
  //   <BasicSearchBox
  //     titleFieldName={titleFieldName}
  //     itemLinkPrefix={itemLinkPrefix}
  //     updateOpetatorConfig={updateOpetatorConfig}
  //     indexName={indexName}
  //     toogleAdvancedConfig={setAdvanced}
  //   />
  // );
};

export default CustomSearchBox;
