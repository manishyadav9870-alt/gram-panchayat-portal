import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user } = useAuth();
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
      icon: Users,
      titleEn: 'Leaving Certificate',
      titleMr: 'रहिवासी दाखला',
      path: '/admin/leaving-certificate/new',
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      adminOnly: true
    },
    {
      icon: Heart,
      titleEn: 'Birth Certificate',
      titleMr: 'जन्म दाखला',
      path: '/services/birth-certificate',
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
      adminOnly: true
    },
    {
      icon: FileText,
      titleEn: 'Death Certificate',
      titleMr: 'मृत्यू दाखला',
      path: '/services/death-certificate',
      color: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      adminOnly: true
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Header />
      <main className="flex-1">
        <Hero />
        
        {/* Stats Cards Section */}
        <section className="-mt-20 relative z-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card 
                    key={index}
                    className={`${stat.color} ${stat.textColor} border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl`}
                  >
                    <CardContent className="p-8 flex items-center justify-between">
                      <div>
                        <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
                        <p className="text-sm font-semibold opacity-90">{t(stat.labelEn, stat.labelMr)}</p>
                      </div>
                      <div className="bg-white/20 p-3 rounded-xl">
                        <Icon className="h-10 w-10" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Online Services Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 via-orange-700 to-gray-900 bg-clip-text text-transparent">
                {t('Online Services', 'ऑनलाइन सेवा')}
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
              <p className="text-gray-700 text-lg font-medium">
                {t('Access all services from home', 'घरबसल्या सर्व सेवा मिळवा')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {services.map((service, index) => {
                const Icon = service.icon;
                // Only disable if adminOnly AND user is not logged in
                const isDisabled = service.adminOnly && !user;
                
                if (isDisabled) {
                  return (
                    <Card key={index} className="bg-white border-2 border-gray-200/60 transition-all duration-500 h-full rounded-3xl opacity-60 cursor-not-allowed">
                      <CardContent className="p-8 text-center">
                        <div className={`w-24 h-24 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                          <Icon className={`h-12 w-12 ${service.iconColor}`} />
                        </div>
                        <h3 className="font-bold text-xl mb-4 text-gray-900">
                          {t(service.titleEn, service.titleMr)}
                        </h3>
                        <Button disabled className="bg-gray-400 text-white w-full rounded-xl shadow-md font-semibold cursor-not-allowed">
                          {t('Admin Only', 'केवळ प्रशासक')}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                }
                
                return (
                  <Link key={index} href={service.path}>
                    <Card className="bg-white border-2 border-gray-200/60 hover:border-orange-400 hover:shadow-2xl transition-all duration-500 cursor-pointer h-full rounded-3xl hover:-translate-y-2 group">
                      <CardContent className="p-8 text-center">
                        <div className={`w-24 h-24 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                          <Icon className={`h-12 w-12 ${service.iconColor}`} />
                        </div>
                        <h3 className="font-bold text-xl mb-4 text-gray-900">
                          {t(service.titleEn, service.titleMr)}
                        </h3>
                        <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white w-full rounded-xl shadow-md hover:shadow-lg transition-all font-semibold">
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
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
              {/* Announcements */}
              <div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl flex items-center gap-3 shadow-lg">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-xl">
                    {t('Latest Announcements', 'ताजी घोषणा')}
                  </h3>
                </div>
                <Card className="rounded-t-none border-2 border-orange-200 rounded-b-2xl shadow-xl">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {announcements.length === 0 ? (
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 pb-4 border-b">
                            <div className="w-2 h-2 rounded-full mt-2 bg-green-600"></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 mb-1">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              <p className="font-medium">{t('Welcome to Gram Panchayat Portal', 'ग्रामपंचायत पोर्टलमध्ये आपले स्वागत आहे')}</p>
                              <p className="text-sm text-gray-600 mt-1">{t('Apply for various certificates and services online', 'विविध प्रमाणपत्रे आणि सेवांसाठी ऑनलाइन अर्ज करा')}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 pb-4 border-b">
                            <div className="w-2 h-2 rounded-full mt-2 bg-orange-600"></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 mb-1">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              <p className="font-medium">{t('New Services Available', 'नवीन सेवा उपलब्ध')}</p>
                              <p className="text-sm text-gray-600 mt-1">{t('Marriage and Leaving Certificates now available online', 'विवाह आणि रहिवासी प्रमाणपत्रे आता ऑनलाइन उपलब्ध')}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full mt-2 bg-green-600"></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 mb-1">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              <p className="font-medium">{t('Office Hours', 'कार्यालय वेळ')}</p>
                              <p className="text-sm text-gray-600 mt-1">{t('Monday to Friday: 10:00 AM - 5:00 PM', 'सोमवार ते शुक्रवार: सकाळी 10:00 - संध्याकाळी 5:00')}</p>
                            </div>
                          </div>
                        </div>
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
                        <Button className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold">
                          {t('View All Announcements', 'सर्व घोषणा पहा')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact */}
              <div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl flex items-center gap-3 shadow-lg">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-xl">
                    {t('Contact', 'संपर्क')}
                  </h3>
                </div>
                <Card className="rounded-t-none border-2 border-blue-200 rounded-b-2xl shadow-xl">
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
