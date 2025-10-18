import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, AlertCircle, Heart, CreditCard, FileCheck, Home, IndianRupee, Users, Sparkles } from 'lucide-react';

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      icon: AlertCircle,
      titleEn: 'File Complaint',
      titleMr: 'तक्रार नोंदवा',
      descEn: 'Register complaints about water supply, electricity, roads, drainage and other civic issues.',
      descMr: 'पाणी पुरवठा, वीज, रस्ते, गटार आणि इतर नागरी समस्यांबद्दल तक्रार नोंदवा.',
      path: '/services/complaint',
      buttonEn: 'File Complaint',
      buttonMr: 'तक्रार नोंदवा',
    },
    {
      icon: Heart,
      titleEn: 'Birth Certificate',
      titleMr: 'जन्म दाखला',
      descEn: 'Apply for birth certificate online. Get official government-issued birth certificate.',
      descMr: 'जन्म दाखल्यासाठी ऑनलाइन अर्ज करा. सरकारी जन्म दाखला मिळवा.',
      path: '/services/birth-certificate',
      buttonEn: 'Apply Now',
      buttonMr: 'अर्ज करा',
    },
    {
      icon: FileText,
      titleEn: 'Death Certificate',
      titleMr: 'मृत्यू दाखला',
      descEn: 'Apply for death certificate online. Submit required documents and track application status.',
      descMr: 'मृत्यू दाखल्यासाठी ऑनलाइन अर्ज करा. आवश्यक कागदपत्रे सबमिट करा.',
      path: '/services/death-certificate',
      buttonEn: 'Apply Now',
      buttonMr: 'अर्ज करा',
    },
    {
      icon: Users,
      titleEn: 'Ration Card',
      titleMr: 'रेशन कार्ड',
      descEn: 'Apply for new ration card or update existing card details with family information.',
      descMr: 'नवीन रेशन कार्डसाठी अर्ज करा किंवा विद्यमान माहिती अपडेट करा.',
      path: '/services/ration-card',
      buttonEn: 'Apply Now',
      buttonMr: 'अर्ज करा',
    },
    {
      icon: FileCheck,
      titleEn: 'Income Certificate',
      titleMr: 'उत्पन्न दाखला',
      descEn: 'Apply for income certificate for various government schemes and educational purposes.',
      descMr: 'विविध सरकारी योजना आणि शैक्षणिक हेतूंसाठी उत्पन्न दाखला मिळवा.',
      path: '/services/income-certificate',
      buttonEn: 'Apply Now',
      buttonMr: 'अर्ज करा',
    },
    {
      icon: Home,
      titleEn: 'Residence Certificate',
      titleMr: 'रहिवासी दाखला',
      descEn: 'Get residence certificate to prove your domicile for official purposes.',
      descMr: 'अधिकृत कामासाठी आपला रहिवास सिद्ध करण्यासाठी दाखला मिळवा.',
      path: '/services/residence-certificate',
      buttonEn: 'Apply Now',
      buttonMr: 'अर्ज करा',
    },
    {
      icon: IndianRupee,
      titleEn: 'Property Tax',
      titleMr: 'मालमत्ता कर',
      descEn: 'View property tax details, payment history and download receipts online.',
      descMr: 'मालमत्ता कर तपशील पहा, भरणा इतिहास आणि पावत्या डाउनलोड करा.',
      path: '/services/property-tax',
      buttonEn: 'View Details',
      buttonMr: 'तपशील पहा',
    },
    {
      icon: CreditCard,
      titleEn: 'Caste Certificate',
      titleMr: 'जात दाखला',
      descEn: 'Apply for caste certificate for reservation benefits in education and employment.',
      descMr: 'शिक्षण आणि रोजगारात आरक्षण लाभासाठी जात दाखला मिळवा.',
      path: '/services/caste-certificate',
      buttonEn: 'Apply Now',
      buttonMr: 'अर्ज करा',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-chart-3/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>
          
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="text-center mb-16 animate-slide-up">
              <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 backdrop-blur-sm shadow-lg">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
                  {t('Digital Services', 'डिजिटल सेवा')}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                {t('Our Services', 'आमच्या सेवा')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t(
                  'Access all government services online. Simple, fast, and transparent.',
                  'सर्व सरकारी सेवा ऑनलाइन मिळवा. सोपे, जलद आणि पारदर्शक.'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={t(service.titleEn, service.titleMr)}
                  description={t(service.descEn, service.descMr)}
                  path={service.path}
                  buttonText={t(service.buttonEn, service.buttonMr)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
