import { createContext } from 'react';

type IntercomContextType = Intercom_.IntercomCommandSignature;

const IntercomContext = createContext<IntercomContextType | null>(null);

export default IntercomContext;
