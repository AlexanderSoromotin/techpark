import { createContext } from 'react';

export interface ContactFormContextValue {
  prefillMessage: string;
  setPrefillMessage: (msg: string) => void;
}

export const ContactFormContext = createContext<ContactFormContextValue>({
  prefillMessage: '',
  setPrefillMessage: () => {},
});

