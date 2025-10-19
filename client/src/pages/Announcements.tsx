import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementCard from '@/components/AnnouncementCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Filter, Sparkles, Megaphone, TrendingUp, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Announcement {
  id: string;
  title: string;
  titleMr: string;
  description: string;
  descriptionMr: string;
  category: string;
  priority: string;
  date: string;
  createdAt: string;
}

export default function Announcements() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>('all');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched announcements:', data);
        setAnnouncements(data);
      } else {
        console.error('Failed to fetch announcements:', response.status);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = filter === 'all' 
    ? announcements 
    : announcements.filter(a => a.priority === filter);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-100/20 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="text-center mb-16 animate-slide-up">
              <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-white/80 backdrop-blur-md border border-orange-200/50 shadow-lg hover:shadow-xl transition-shadow">
                <Bell className="h-4 w-4 text-orange-600 animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  {t('Latest Updates', 'ताजी माहिती')}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-orange-700 to-gray-900 bg-clip-text text-transparent">
                {t('Announcements', 'घोषणा')}
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
                {t('Stay updated with latest news and notices from Gram Panchayat', 'ग्रामपंचायतीच्या ताज्या बातम्या आणि सूचनांसह अद्यतनित रहा')}
              </p>
            </div>
          </div>
        </section>

        {/* Announcements Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50/50">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Megaphone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">{t('Total Announcements', 'एकूण घोषणा')}</p>
                    <p className="text-2xl font-bold">{announcements.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">{t('Important', 'महत्वाचे')}</p>
                    <p className="text-2xl font-bold">{announcements.filter(a => a.priority === 'high').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Filter className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">{t('Showing', 'दाखवत आहे')}</p>
                    <p className="text-2xl font-bold">{filteredAnnouncements.length}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="lg"
                onClick={() => setFilter('all')}
                data-testid="button-filter-all"
                className="rounded-xl"
              >
                <Filter className="h-4 w-4 mr-2" />
                {t('All', 'सर्व')}
              </Button>
              <Button 
                variant={filter === 'high' ? 'default' : 'outline'} 
                size="lg"
                onClick={() => setFilter('high')}
                data-testid="button-filter-important"
                className="rounded-xl"
              >
                {t('Important', 'महत्वाचे')}
              </Button>
              <Button 
                variant={filter === 'normal' ? 'default' : 'outline'} 
                size="lg"
                onClick={() => setFilter('normal')}
                data-testid="button-filter-normal"
                className="rounded-xl"
              >
                {t('General', 'सामान्य')}
              </Button>
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{t('Loading announcements...', 'घोषणा लोड होत आहेत...')}</p>
                </div>
              ) : filteredAnnouncements.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{t('No announcements found', 'कोणत्याही घोषणा सापडल्या नाहीत')}</p>
                </div>
              ) : (
                filteredAnnouncements.map((announcement, index) => (
                  <AnnouncementCard 
                    key={announcement.id || index} 
                    title={announcement.title}
                    titleMr={announcement.titleMr}
                    description={announcement.description}
                    descriptionMr={announcement.descriptionMr}
                    category={announcement.category}
                    priority={announcement.priority as 'high' | 'normal' | 'low' | 'urgent'}
                    date={announcement.date}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
