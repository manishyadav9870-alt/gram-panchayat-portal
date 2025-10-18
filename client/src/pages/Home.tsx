import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Heart, AlertCircle, Building2, Award } from 'lucide-react';
import { Link } from 'wouter';
import { useState, useEffect } from 'react';

interface Announcement {
  id: string;
  title: string;
  titleMr: string;
  description: string;
  descriptionMr: string;
  date: string;
  priority: string;
}

export default function Home() {
  const { t, language } = useLanguage();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      const data = await response.json();
      // Get latest 3 announcements
      setAnnouncements(data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  const stats = [
    { 
      icon: Users, 
      labelEn: 'Population', 
      labelMr: 'लोकसंख्या', 
      value: '5000+',
      color: 'bg-green-600',
      textColor: 'text-white'
    },
    { 
      icon: FileText, 
      labelEn: 'Services', 
      labelMr: 'सेवा', 
      value: '25+',
      color: 'bg-orange-500',
      textColor: 'text-white'
    },
    { 
      icon: Building2, 
      labelEn: 'Applications', 
      labelMr: 'अर्ज', 
      value: '500+',
      color: 'bg-cyan-500',
      textColor: 'text-white'
    },
    { 
      icon: Award, 
      labelEn: 'Success Rate', 
      labelMr: 'यश दर', 
      value: '95%',
      color: 'bg-yellow-500',
      textColor: 'text-white'
    },
  ];

  const services = [
    {
      icon: AlertCircle,
      titleEn: 'File Complaint',
      titleMr: 'तक्रार नोंदवा',
      path: '/services/complaint',
      color: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Heart,
      titleEn: 'Birth Certificate',
      titleMr: 'जन्म दाखला',
      path: '/services/birth-certificate',
      color: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      icon: FileText,
      titleEn: 'Death Certificate',
      titleMr: 'मृत्यू दाखला',
      path: '/services/death-certificate',
      color: 'bg-cyan-100',
      iconColor: 'text-cyan-600'
    },
    {
      icon: Users,
      titleEn: 'Ration Card',
      titleMr: 'रेशन कार्ड',
      path: '/services/ration-card',
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Hero />
        
        {/* Stats Cards Section */}
        <section className="-mt-16 relative z-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card 
                    key={index}
                    className={`${stat.color} ${stat.textColor} border-0 shadow-lg hover:shadow-xl transition-shadow duration-300`}
                  >
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
                        <p className="text-sm opacity-90">{t(stat.labelEn, stat.labelMr)}</p>
                      </div>
                      <Icon className="h-12 w-12 opacity-80" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Online Services Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                {t('Online Services', 'ऑनलाइन सेवा')}
              </h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {t('Access all services from home', 'घरबसल्या सर्व सेवा मिळवा')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Link key={index} href={service.path}>
                    <Card className="bg-white border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                      <CardContent className="p-6 text-center">
                        <div className={`w-20 h-20 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <Icon className={`h-10 w-10 ${service.iconColor}`} />
                        </div>
                        <h3 className="font-bold text-lg mb-3">
                          {t(service.titleEn, service.titleMr)}
                        </h3>
                        <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                          {t('Apply Now', 'अर्ज करा')}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Latest Announcements Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Announcements */}
              <div>
                <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                  <h3 className="font-bold text-lg">
                    {t('Latest Announcements', 'ताजी घोषणा')}
                  </h3>
                </div>
                <Card className="rounded-t-none border-2 border-green-600">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {announcements.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">
                          {t('No announcements available', 'कोणतीही घोषणा उपलब्ध नाही')}
                        </p>
                      ) : (
                        announcements.map((announcement, index) => (
                          <div 
                            key={announcement.id} 
                            className={`flex items-start gap-3 ${index < announcements.length - 1 ? 'pb-4 border-b' : ''}`}
                          >
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              announcement.priority === 'urgent' ? 'bg-red-600' :
                              announcement.priority === 'high' ? 'bg-orange-600' :
                              'bg-green-600'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 mb-1">
                                {new Date(announcement.date).toLocaleDateString('en-IN', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </p>
                              <p className="font-medium">
                                {language === 'en' ? announcement.title : announcement.titleMr}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {language === 'en' ? announcement.description : announcement.descriptionMr}
                              </p>
                            </div>
                            {announcement.priority === 'urgent' && (
                              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded">
                                {t('Urgent', 'तातडीचे')}
                              </span>
                            )}
                          </div>
                        ))
                      )}
                      <Link href="/announcements">
                        <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                          {t('View All Announcements', 'सर्व घोषणा पहा')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact */}
              <div>
                <div className="bg-orange-500 text-white p-4 rounded-t-lg flex items-center justify-between">
                  <h3 className="font-bold text-lg">
                    {t('Contact', 'संपर्क')}
                  </h3>
                </div>
                <Card className="rounded-t-none border-2 border-orange-500">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <p className="font-bold mb-2">{t('Office', 'कार्यालय')}</p>
                        <p className="text-gray-600">
                          {t('Gram Panchayat Office, Main Road', 'ग्रामपंचायत कार्यालय, मुख्य रस्ता')}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold mb-2">{t('Phone', 'दूरध्वनी')}</p>
                        <p className="text-gray-600">+91 12345 67890</p>
                      </div>
                      <div>
                        <p className="font-bold mb-2">{t('Email', 'ईमेल')}</p>
                        <p className="text-gray-600">info@grampanchayat.gov.in</p>
                      </div>
                      <div>
                        <p className="font-bold mb-2">{t('Office Hours', 'कार्यालयीन वेळ')}</p>
                        <p className="text-gray-600">
                          {t('Mon-Fri: 10:00 AM - 5:00 PM', 'सोम-शुक्र: १० ते ५')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
