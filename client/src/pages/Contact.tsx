import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

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
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              {t('Contact Us', 'आमच्याशी संपर्क साधा')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('Get in touch with us for any queries or assistance', 'कोणत्याही प्रश्न किंवा सहाय्यासाठी आमच्याशी संपर्क साधा')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      {t(info.titleEn, info.titleMr)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line" data-testid={`contact-${index}`}>
                      {t(info.detailsEn, info.detailsMr)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-center">
                {t('Emergency Contact', 'आणीबाणी संपर्क')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                {t('For urgent matters and emergencies, please call:', 'तातडीच्या बाबी आणि आणीबाणीसाठी, कृपया कॉल करा:')}
              </p>
              <p className="text-3xl font-bold text-primary" data-testid="text-emergency-number">
                +91 98765 00000
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('Available 24/7', '२४/७ उपलब्ध')}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
