import DeathCertificateForm from '../DeathCertificateForm';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function DeathCertificateFormExample() {
  return (
    <LanguageProvider>
      <div className="p-6">
        <DeathCertificateForm />
      </div>
    </LanguageProvider>
  );
}
