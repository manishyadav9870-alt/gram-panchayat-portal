import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, Sparkles } from 'lucide-react';

export default function Contact() {
  const { t } = useLanguage();

  const contactInfo = [
    {
      icon: MapPin,
      titleEn: 'Office Address',
      titleMr: 'कार्यालयाचा पत्ता',
      detailsEn: 'Gram Panchayat Office, Main Road, Village Name, Dist. Name - 123456',
      detailsMr: 'ग्रामपंचायत कार्यालय, मुख्य रस्ता, गावाचे नाव, जिल्हा नाव - १२३४५६',
    },
    {
      icon: Phone,
      titleEn: 'Phone Numbers',
      titleMr: 'दूरध्वनी क्रमांक',
      detailsEn: 'Office: +91 12345 67890\nSarpanch: +91 98765 43210',
      detailsMr: 'कार्यालय: +९१ १२३४५ ६७८९०\nसरपंच: +९१ ९८७६५ ४३२१०',
    },
    {
      icon: Mail,
      titleEn: 'Email',
      titleMr: 'ईमेल',
      detailsEn: 'info@grampanchayat.gov.in\nsarpanch@grampanchayat.gov.in',
      detailsMr: 'info@grampanchayat.gov.in\nsarpanch@grampanchayat.gov.in',
    },
    {
      icon: Clock,
      titleEn: 'Office Hours',
      titleMr: 'कार्यालयीन वेळ',
      detailsEn: 'Monday - Friday: 10:00 AM - 5:00 PM\nSaturday: 10:00 AM - 1:00 PM\nSunday & Holidays: Closed',
      detailsMr: 'सोमवार - शुक्रवार: सकाळी १० ते संध्याकाळी ५\nशनिवार: सकाळी १० ते दुपारी १\nरविवार आणि सुट्टीच्या दिवशी बंद',
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

          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="text-center mb-16 animate-slide-up">
              <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 backdrop-blur-sm shadow-lg">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
                  {t('We\'re Here to Help', 'आम्ही मदतीसाठी आहोत')}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                {t('Contact Us', 'आमच्याशी संपर्क साधा')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('Get in touch with us for any queries or assistance', 'कोणत्याही प्रश्न किंवा सहाय्यासाठी आमच्याशी संपर्क साधा')}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Cards Section */}
        <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                const gradients = [
                  'from-blue-500 to-cyan-500',
                  'from-purple-500 to-pink-500',
                  'from-orange-500 to-red-500',
                  'from-green-500 to-emerald-500'
                ];
                return (
                  <Card key={index} className="card-modern glass-card border-2 border-white/20 rounded-3xl group hover:border-primary/40 transition-all duration-300 hover:shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-4">
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${gradients[index]} text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <span className="text-xl font-bold">{t(info.titleEn, info.titleMr)}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-lg" data-testid={`contact-${index}`}>
                        {t(info.detailsEn, info.detailsMr)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Emergency Contact Card */}
            <Card className="card-modern glass-card border-2 border-destructive/40 rounded-3xl bg-gradient-to-br from-destructive/10 to-destructive/5 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent"></div>
              <CardHeader className="relative">
                <CardTitle className="text-center flex flex-col md:flex-row items-center justify-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center shadow-2xl animate-pulse">
                    <Phone className="h-8 w-8" />
                  </div>
                  <span className="text-2xl md:text-3xl font-bold">{t('Emergency Contact', 'आणीबाणी संपर्क')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center relative">
                <p className="text-muted-foreground mb-8 text-lg">
                  {t('For urgent matters and emergencies, please call:', 'तातडीच्या बाबी आणि आणीबाणीसाठी, कृपया कॉल करा:')}
                </p>
                <p className="text-5xl md:text-6xl font-extrabold mb-6" data-testid="text-emergency-number">
                  <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    +91 98765 00000
                  </span>
                </p>
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-destructive/10 border-2 border-destructive/30 shadow-lg">
                  <span className="h-3 w-3 rounded-full bg-destructive animate-pulse shadow-lg"></span>
                  <p className="text-base font-bold text-destructive">
                    {t('Available 24/7', '२४/७ उपलब्ध')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
