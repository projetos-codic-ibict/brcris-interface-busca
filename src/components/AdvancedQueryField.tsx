/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

type AdvancedQueryFieldProps = {
  sequenceProp: number;
  fieldProp: string;
  valueProp: string;
  opProp: string;
  onChangeValue: (event: any) => void;
};

const AdvancedQueryField = ({ sequenceProp, fieldProp, valueProp, opProp, onChangeValue }: AdvancedQueryFieldProps) => {
  const [field, setField] = useState(fieldProp);
  const [value, setValue] = useState(valueProp);
  const [op, setOp] = useState(opProp);

  const handleChange = (event: any) => {
    onChangeValue(event);
  };

  return (
    <div className="">
      <select
        id={`field-${sequenceProp}`}
        onChange={(e) => {
          setField(e.target.value);
          handleChange(event);
        }}
      >
        <option selected={field == 'All field'} value="All fields">
          All fields
        </option>
        <option value="Title">Title</option>
        <option value="Keyword">Keyword</option>
      </select>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handleChange(event);
        }}
        type="text"
        id={`value-${sequenceProp}`}
      />
      <select
        id={`op-${sequenceProp}`}
        onChange={(e) => {
          setOp(e.target.value);
          handleChange(event);
        }}
      >
        <option selected={op == 'AND'} value="AND">
          + AND
        </option>
        <option value="OR">+ OR</option>
      </select>
    </div>
  );
};

export default AdvancedQueryField;
