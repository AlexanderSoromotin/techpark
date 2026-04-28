import { useContext } from 'react';
import { ContactFormContext } from './ContactFormContext';

export const useContactForm = () => useContext(ContactFormContext);

