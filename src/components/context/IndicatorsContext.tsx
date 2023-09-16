import { PropsWithChildren, createContext, useState } from 'react';
import { IndicatorType } from '../../types/Entities';

interface IndicadorContextProps {
  indicators: IndicatorType[][];
  setIndicatorsData: (data: Array<IndicatorType[]>) => void;
  isEmpty: () => boolean;
}

const IndicatorContext = createContext<IndicadorContextProps>({} as IndicadorContextProps);
export default IndicatorContext;

export function IndicatorProvider(props: PropsWithChildren<object>) {
  const [indicators, setIndicators] = useState<Array<IndicatorType[]>>([] as Array<IndicatorType[]>);

  function setIndicatorsData(data: Array<IndicatorType[]>) {
    setIndicators(data);
  }

  function isEmpty(): boolean {
    return indicators.length < 1 || indicators[0] == null || indicators[0].length < 1;
  }

  return (
    <IndicatorContext.Provider
      value={{
        indicators,
        setIndicatorsData,
        isEmpty,
      }}
    >
      {props.children}
    </IndicatorContext.Provider>
  );
}
