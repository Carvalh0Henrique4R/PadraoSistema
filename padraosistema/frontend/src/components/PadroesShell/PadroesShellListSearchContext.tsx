import React from "react";

export type PadroesShellListSearchRegistration = {
  onValueChange: (value: string) => void;
  value: string;
};

type SetRegistration = React.Dispatch<React.SetStateAction<PadroesShellListSearchRegistration | null>>;

const PadroesShellListSearchSetterContext = React.createContext<SetRegistration | null>(null);
const PadroesShellListSearchValueContext = React.createContext<PadroesShellListSearchRegistration | null>(null);

export const PadroesShellListSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registration, setRegistration] = React.useState<PadroesShellListSearchRegistration | null>(null);
  return (
    <PadroesShellListSearchSetterContext.Provider value={setRegistration}>
      <PadroesShellListSearchValueContext.Provider value={registration}>
        {children}
      </PadroesShellListSearchValueContext.Provider>
    </PadroesShellListSearchSetterContext.Provider>
  );
};

export const usePadroesShellListSearchRegistration = (): PadroesShellListSearchRegistration | null => {
  return React.useContext(PadroesShellListSearchValueContext);
};

export const useRegisterPadroesListSearchInHeader = (
  value: string,
  onValueChange: (next: string) => void,
): void => {
  const setRegistration = React.useContext(PadroesShellListSearchSetterContext);
  const onValueChangeRef = React.useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  const stableOnValueChange = React.useCallback((next: string): void => {
    onValueChangeRef.current(next);
  }, []);

  React.useEffect(() => {
    if (setRegistration == null) {
      return undefined;
    }
    setRegistration({
      onValueChange: stableOnValueChange,
      value,
    });
    return undefined;
  }, [setRegistration, stableOnValueChange, value]);

  React.useEffect(() => {
    if (setRegistration == null) {
      return undefined;
    }
    return (): void => {
      setRegistration(null);
    };
  }, [setRegistration]);
};
