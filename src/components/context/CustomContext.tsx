import { PropsWithChildren, createContext, useState } from 'react';
import { IndicatorType } from '../../types/Entities';

interface CustomContextProps {
  indicators: IndicatorType[][];
  setIndicatorsData: (data: Array<IndicatorType[]>) => void;
  isEmpty: () => boolean;
  advanced: boolean;
  setAdvanced: (advanced: boolean) => void;
}

const CustomContext = createContext<CustomContextProps>({} as CustomContextProps);
export default CustomContext;

export function CustomProvider(props: PropsWithChildren<object>) {
  const [indicators, setIndicators] = useState<Array<IndicatorType[]>>([] as Array<IndicatorType[]>);
  const [advanced, setAdvanced] = useState(false);

  function setIndicatorsData(data: Array<IndicatorType[]>) {
    setIndicators(data);
  }

  function isEmpty(): boolean {
    return indicators?.length < 1 || indicators[0] == null || indicators[0].length < 1;
  }

  return (
    <CustomContext.Provider
      value={{
        indicators,
        setIndicatorsData,
        isEmpty,
        advanced,
        setAdvanced,
      }}
    >
      {props.children}
    </CustomContext.Provider>
  );
}
