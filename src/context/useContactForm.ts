import { useContext } from 'react';
import { ContactFormContext } from './ContactFormContextBase';

export const useContactForm = () => useContext(ContactFormContext);

