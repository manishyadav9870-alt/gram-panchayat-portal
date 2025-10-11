import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'processing';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useLanguage();

  const statusConfig = {
    pending: {
      labelEn: 'Pending',
      labelMr: 'प्रलंबित',
      className: 'bg-chart-4 text-white hover:bg-chart-4/90'
    },
    processing: {
      labelEn: 'Processing',
      labelMr: 'प्रक्रिया सुरु',
      className: 'bg-chart-3 text-white hover:bg-chart-3/90'
    },
    approved: {
      labelEn: 'Approved',
      labelMr: 'मंजूर',
      className: 'bg-chart-2 text-white hover:bg-chart-2/90'
    },
    rejected: {
      labelEn: 'Rejected',
      labelMr: 'नाकारले',
      className: 'bg-chart-5 text-white hover:bg-chart-5/90'
    },
  };

  const config = statusConfig[status];

  return (
    <Badge className={config.className} data-testid={`badge-status-${status}`}>
      {t(config.labelEn, config.labelMr)}
    </Badge>
  );
}
