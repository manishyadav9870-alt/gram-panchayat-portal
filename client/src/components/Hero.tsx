import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { FileText, AlertCircle, Heart, Megaphone } from 'lucide-react';

export default function Hero() {
  const { t } = useLanguage();

  const quickServices = [
    { 
      icon: AlertCircle, 
      labelEn: 'File Complaint', 
      labelMr: 'तक्रार नोंदवा', 
      path: '/services/complaint',
      color: 'bg-chart-1 text-white'
    },
    { 
      icon: Heart, 
      labelEn: 'Birth Certificate', 
      labelMr: 'जन्म दाखला', 
      path: '/services/birth-certificate',
      color: 'bg-chart-2 text-white'
    },
    { 
      icon: FileText, 
      labelEn: 'Death Certificate', 
      labelMr: 'मृत्यू दाखला', 
      path: '/services/death-certificate',
      color: 'bg-chart-3 text-white'
    },
    { 
      icon: Megaphone, 
      labelEn: 'View Announcements', 
      labelMr: 'घोषणा पहा', 
      path: '/announcements',
      color: 'bg-chart-4 text-white'
    },
  ];

  return (
    <div className="relative bg-gradient-to-br from-primary/10 via-background to-chart-2/10">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {t('Welcome to Kishore Gram Panchayat', 'किशोर ग्रामपंचायत')}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
            {t('Digital Services Portal', 'डिजिटल सेवा पोर्टल')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              'Access government services online. Apply for certificates, file complaints, and track your applications easily.',
              'सरकारी सेवा ऑनलाइन मिळवा. प्रमाणपत्रांसाठी अर्ज करा, तक्रारी नोंदवा आणि आपल्या अर्जाचा मागोवा घ्या.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {quickServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link key={index} href={service.path} data-testid={`link-service-${service.labelEn.toLowerCase().replace(' ', '-')}`}>
                <div className="group hover-elevate active-elevate-2 rounded-lg border bg-card p-6 text-center transition-all">
                  <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${service.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-2">{t(service.labelEn, service.labelMr)}</h3>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/services" data-testid="link-all-services">
            <Button size="lg" className="gap-2">
              {t('View All Services', 'सर्व सेवा पहा')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
