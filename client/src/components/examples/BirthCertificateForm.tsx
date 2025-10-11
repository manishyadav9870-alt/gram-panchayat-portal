import BirthCertificateForm from '../BirthCertificateForm';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function BirthCertificateFormExample() {
  return (
    <LanguageProvider>
      <div className="p-6">
        <BirthCertificateForm />
      </div>
    </LanguageProvider>
  );
}
