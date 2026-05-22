import { useState } from 'react';
import type { ReactNode } from 'react';
import { ContactFormContext } from './ContactFormContextBase';

export function ContactFormProvider({ children }: { children: ReactNode }) {
  const [prefillMessage, setPrefillMessage] = useState('');
  return (
    <ContactFormContext.Provider value={{ prefillMessage, setPrefillMessage }}>
      {children}
    </ContactFormContext.Provider>
  );
}




