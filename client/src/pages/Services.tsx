import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, AlertCircle, Heart, CreditCard, FileCheck, Home, IndianRupee, Users, Sparkles, UserCheck, Building2, Droplets } from 'lucide-react';

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
      icon: UserCheck,
      titleEn: 'Leaving Certificate',
      titleMr: 'रहिवासी दाखला',
      descEn: 'Apply for leaving/residence certificate. Proof of residence for official purposes. (Admin Only)',
      descMr: 'रहिवासी दाखल्यासाठी अर्ज करा. अधिकृत कामासाठी निवासाचा पुरावा. (केवळ प्रशासक)',
      path: '/admin/leaving-certificate/new',
      buttonEn: 'Admin Only',
      buttonMr: 'केवळ प्रशासक',
      adminOnly: true,
    },
    {
      icon: Heart,
      titleEn: 'Birth Certificate',
      titleMr: 'जन्म दाखला',
      descEn: 'Apply for birth certificate online. Get official government-issued birth certificate. (Admin Only)',
      descMr: 'जन्म दाखल्यासाठी ऑनलाइन अर्ज करा. सरकारी जन्म दाखला मिळवा. (केवळ प्रशासक)',
      path: '/services/birth-certificate',
      buttonEn: 'Admin Only',
      buttonMr: 'केवळ प्रशासक',
      adminOnly: true,
    },
    {
      icon: FileText,
      titleEn: 'Death Certificate',
      titleMr: 'मृत्यू दाखला',
      descEn: 'Apply for death certificate online. Submit required documents and track application status. (Admin Only)',
      descMr: 'मृत्यू दाखल्यासाठी ऑनलाइन अर्ज करा. आवश्यक कागदपत्रे सबमिट करा. (केवळ प्रशासक)',
      path: '/services/death-certificate',
      buttonEn: 'Admin Only',
      buttonMr: 'केवळ प्रशासक',
      adminOnly: true,
    },
    {
      icon: Heart,
      titleEn: 'Marriage Certificate',
      titleMr: 'विवाह प्रमाणपत्र',
      descEn: 'Apply for marriage registration certificate. Official proof of marriage. (Admin Only)',
      descMr: 'विवाह नोंदणी प्रमाणपत्रासाठी अर्ज करा. विवाहाचा अधिकृत पुरावा. (केवळ प्रशासक)',
      path: '/admin/marriage-certificate/new',
      buttonEn: 'Admin Only',
      buttonMr: 'केवळ प्रशासक',
      adminOnly: true,
    },
    {
      icon: Building2,
      titleEn: 'Property Tax',
      titleMr: 'घरपट्टी',
      descEn: 'View property tax details, payment history and download receipts online.',
      descMr: 'मालमत्ता कर तपशील, भुगतान इतिहास पहा आणि पावती डाउनलोड करा.',
      path: '/services/property-tax',
      buttonEn: 'View Details',
      buttonMr: 'तपशील पहा',
    },
    {
      icon: Droplets,
      titleEn: 'Water Bill',
      titleMr: 'पाणी बिल',
      descEn: 'Check water bill, view payment history and pending bills by house number.',
      descMr: 'घर पट्टी नंबरानुसार पाणी बिल, भुगतान इतिहास आणि बाकी बिल पहा.',
      path: '/services/water-bill',
      buttonEn: 'Check Bill',
      buttonMr: 'बिल पहा',
    },
    {
      icon: Users,
      titleEn: 'Ration Card',
      titleMr: 'रेशन कार्ड',
      descEn: 'Apply for new ration card or update existing card details with family information. (Coming Soon)',
      descMr: 'नवीन रेशन कार्डसाठी अर्ज करा किंवा विद्यमान माहिती अपडेट करा. (लवकरच येत आहे)',
      path: '#',
      buttonEn: 'Coming Soon',
      buttonMr: 'लवकरच येत आहे',
    },
    {
      icon: FileCheck,
      titleEn: 'Income Certificate',
      titleMr: 'उत्पन्न दाखला',
      descEn: 'Apply for income certificate for various government schemes and educational purposes. (Coming Soon)',
      descMr: 'विविध सरकारी योजना आणि शैक्षणिक हेतूंसाठी उत्पन्न दाखला मिळवा. (लवकरच येत आहे)',
      path: '#',
      buttonEn: 'Coming Soon',
      buttonMr: 'लवकरच येत आहे',
    },
    {
      icon: Home,
      titleEn: 'Residence Certificate',
      titleMr: 'रहिवासी दाखला',
      descEn: 'Get residence certificate to prove your domicile for official purposes. (Coming Soon)',
      descMr: 'अधिकृत कामासाठी आपला रहिवास सिद्ध करण्यासाठी दाखला मिळवा. (लवकरच येत आहे)',
      path: '#',
      buttonEn: 'Coming Soon',
      buttonMr: 'लवकरच येत आहे',
    },
    {
      icon: CreditCard,
      titleEn: 'Caste Certificate',
      titleMr: 'जात दाखला',
      descEn: 'Apply for caste certificate for reservation benefits in education and employment. (Coming Soon)',
      descMr: 'शिक्षण आणि रोजगारात आरक्षण लाभासाठी जात दाखला मिळवा. (लवकरच येत आहे)',
      path: '#',
      buttonEn: 'Coming Soon',
      buttonMr: 'लवकरच येत आहे',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-8 md:py-12 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-100/20 to-transparent rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="text-center mb-8 animate-slide-up">
              <div className="inline-flex items-center gap-2 mb-4 px-6 py-3 rounded-full bg-white/80 backdrop-blur-md border border-orange-200/50 shadow-lg hover:shadow-xl transition-shadow">
                <Sparkles className="h-4 w-4 text-orange-600 animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  {t('Digital Services', 'डिजिटल सेवा')}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-orange-800">
                {t('Our Services', 'आमच्या सेवा')}
              </h1>
              <p className="text-base md:text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed font-medium">
                {t(
                  'Access all government services online. Simple, fast, and transparent.',
                  'सर्व सरकारी सेवा ऑनलाइन मिळवा. सोपे, जलद आणि पारदर्शक.'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50/50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={t(service.titleEn, service.titleMr)}
                  description={t(service.descEn, service.descMr)}
                  path={service.path}
                  buttonText={t(service.buttonEn, service.buttonMr)}
                  adminOnly={service.adminOnly}
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
