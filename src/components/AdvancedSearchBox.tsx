/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchBox } from '@elastic/react-search-ui';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AdvancedFieldType } from '../types/Entities';
import AdvancedQueryField from './AdvancedQueryField';

type CustomSearchBoxProps = {
  updateQueryConfig: (advancedFields: AdvancedFieldType[]) => void;
};

const AdvancedSearchBox = ({ updateQueryConfig }: CustomSearchBoxProps) => {
  // const { t } = useTranslation('common');
  const router = useRouter();
  const [advancedFields, setAdvancedFields] = useState<AdvancedFieldType[]>([
    {
      sequence: 1,
      field: 'All fields',
      value: 'ggg',
      op: 'AND',
    },
  ]);
  const [fullQuery, setFullQuery] = useState(
    advancedFields.map((field) => `${field.field}=${field.value}${field.op}`).join('')
  );

  const handleChangeValue = (event: any) => {
    const [field, sequence]: [string, string] = event.target.id.split('-');
    console.log('####sequence', sequence);
    const advancedFieldTarget = advancedFields.find((element) => element.sequence == parseInt(sequence));
    console.log('####advancedFieldTarget', advancedFieldTarget);
    //@ts-ignore
    if (advancedFieldTarget) advancedFieldTarget[field as keyof AdvancedFieldType] = event.target.value;
    setFullQuery(advancedFields.map((field) => `${field.field}=${field.value}${field.op}`).join(''));
  };
  // eslint-disable-next-line react/jsx-key
  const [advancedFieldsEl, setAdvancedFieldsEl] = useState([
    <AdvancedQueryField
      key={1}
      onChangeValue={handleChangeValue}
      sequenceProp={1}
      fieldProp={'All fields'}
      valueProp={''}
      opProp={'AND'}
    />,
  ]);

  return (
    <>
      {/* <AdvancedQueryField count={0} /> */}
      {advancedFieldsEl.map((item) => (
        <div key={item.props.sequence}>{item}</div>
      ))}
      <button
        onClick={() => {
          const newAdvancedField: AdvancedFieldType = {
            sequence: advancedFields.length + 1,
            field: 'All fields',
            value: '',
            op: 'AND',
          };
          advancedFields.push(newAdvancedField);
          // eslint-disable-next-line react/jsx-key
          setAdvancedFields(advancedFields);
          setAdvancedFieldsEl([
            ...advancedFieldsEl,
            <AdvancedQueryField
              key={newAdvancedField.sequence}
              onChangeValue={handleChangeValue}
              sequenceProp={newAdvancedField.sequence}
              fieldProp={newAdvancedField.field}
              valueProp={newAdvancedField.value}
              opProp={newAdvancedField.op}
            />,
          ]);
        }}
      >
        ADD
      </button>
      <SearchBox
        onSubmit={(searchTerm) => {
          searchTerm = advancedFields.map((field) => `${field.field}=${field.value}${field.op}`).join('&&');
          updateQueryConfig(advancedFields);
          router.query.q = `advanced=true&&${searchTerm}`;
          router.push(router);
        }}
        view={({ onChange, onSubmit }) => (
          <form onSubmit={onSubmit}>
            <input className="" type="text" value={fullQuery} onChange={(e) => onChange(e.target.value)} />
            <input type="submit" value="Search" />
          </form>
        )}
      />
    </>
  );
};

export default AdvancedSearchBox;
