import ComplaintForm from '../ComplaintForm';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function ComplaintFormExample() {
  return (
    <LanguageProvider>
      <div className="p-6">
        <ComplaintForm />
      </div>
    </LanguageProvider>
  );
}
