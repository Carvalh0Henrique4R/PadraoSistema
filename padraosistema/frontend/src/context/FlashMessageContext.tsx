import React from "react";

type FlashContextValue = {
  showSuccess: (message: string) => void;
};

const FlashMessageContext = React.createContext<FlashContextValue | null>(null);

export const FlashMessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = React.useState<string | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSuccess = React.useCallback((msg: string): void => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
    }
    setMessage(msg);
    timeoutRef.current = setTimeout(() => {
      setMessage(null);
      timeoutRef.current = null;
    }, 4000);
  }, []);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const value = React.useMemo((): FlashContextValue => ({ showSuccess }), [showSuccess]);

  return (
    <FlashMessageContext.Provider value={value}>
      {children}
      {message === null ? null : (
        <div
          className="fixed bottom-6 left-1/2 z-[100] max-w-[min(90vw,28rem)] -translate-x-1/2 rounded-lg bg-emerald-600 px-4 py-3 text-center text-sm font-medium text-white shadow-lg"
          role="status"
        >
          {message}
        </div>
      )}
    </FlashMessageContext.Provider>
  );
};

export const useFlashMessage = (): FlashContextValue => {
  const ctx = React.useContext(FlashMessageContext);
  if (ctx == null) {
    throw new Error("useFlashMessage must be used within FlashMessageProvider");
  }
  return ctx;
};
