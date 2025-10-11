import StatusBadge from '../StatusBadge';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function StatusBadgeExample() {
  return (
    <LanguageProvider>
      <div className="flex flex-wrap gap-2 p-6">
        <StatusBadge status="pending" />
        <StatusBadge status="processing" />
        <StatusBadge status="approved" />
        <StatusBadge status="rejected" />
      </div>
    </LanguageProvider>
  );
}
