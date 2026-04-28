import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ContactFormContextValue {
  prefillMessage: string;
  setPrefillMessage: (msg: string) => void;
}

export const ContactFormContext = createContext<ContactFormContextValue>({
  prefillMessage: '',
  setPrefillMessage: () => {},
});

export function ContactFormProvider({ children }: { children: ReactNode }) {
  const [prefillMessage, setPrefillMessage] = useState('');
  return (
    <ContactFormContext.Provider value={{ prefillMessage, setPrefillMessage }}>
      {children}
    </ContactFormContext.Provider>
  );
}




