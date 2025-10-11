import ServiceCard from '../ServiceCard';
import { FileText } from 'lucide-react';

export default function ServiceCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <ServiceCard
        icon={FileText}
        title="Birth Certificate"
        description="Apply for birth certificate online. Get official government-issued birth certificate delivered to your address."
        path="/services/birth-certificate"
        buttonText="Apply Now"
      />
    </div>
  );
}
