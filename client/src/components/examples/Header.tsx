import Header from '../Header';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function HeaderExample() {
  return (
    <LanguageProvider>
      <Header />
    </LanguageProvider>
  );
}
