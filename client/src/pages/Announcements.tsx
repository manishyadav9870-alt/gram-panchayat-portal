import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementCard from '@/components/AnnouncementCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Filter, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Announcements() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>('all');

  //todo: remove mock functionality
  const announcements = [
    {
      title: 'Property Tax Payment Deadline Extended',
      titleMr: 'मालमत्ता कर भरण्याची अंतिम मुदत वाढवली',
      description: 'The deadline for property tax payment has been extended to March 31st, 2024. Citizens can now pay their taxes without any late fees until this date. Online payment facility is also available through our portal.',
      descriptionMr: 'मालमत्ता कर भरण्याची अंतिम मुदत ३१ मार्च २०२४ पर्यंत वाढवण्यात आली आहे. नागरिक या तारखेपर्यंत कोणत्याही विलंब शुल्काशिवाय त्यांचे कर भरू शकतात. आमच्या पोर्टलद्वारे ऑनलाइन पेमेंटची सुविधा देखील उपलब्ध आहे.',
      category: 'Tax',
      priority: 'high' as const,
      date: '2024-02-15',
    },
    {
      title: 'Free Vaccination Drive Next Week',
      titleMr: 'पुढील आठवड्यात मोफत लसीकरण मोहीम',
      description: 'A free vaccination drive will be conducted at the village community center from February 20-22, 2024. All children below 5 years and senior citizens above 60 are requested to participate.',
      descriptionMr: 'गाव समुदाय केंद्रावर २० ते २२ फेब्रुवारी २०२४ या कालावधीत मोफत लसीकरण मोहीम राबविली जाईल. ५ वर्षाखालील सर्व मुले आणि ६० वर्षांवरील ज्येष्ठ नागरिकांना सहभागी होण्याची विनंती.',
      category: 'Health',
      priority: 'normal' as const,
      date: '2024-02-10',
    },
    {
      title: 'New Water Supply Scheme Launched',
      titleMr: 'नवीन पाणी पुरवठा योजना सुरू',
      description: 'The Gram Panchayat has launched a new water supply scheme to ensure 24/7 clean drinking water to all households. Installation work will begin from next month.',
      descriptionMr: 'ग्रामपंचायतीने सर्व घरांना २४/७ स्वच्छ पिण्याचे पाणी सुनिश्चित करण्यासाठी नवीन पाणी पुरवठा योजना सुरू केली आहे. पुढील महिन्यापासून बसवणुकीचे काम सुरू होईल.',
      category: 'Infrastructure',
      priority: 'high' as const,
      date: '2024-02-08',
    },
    {
      title: 'Skill Development Training Program',
      titleMr: 'कौशल्य विकास प्रशिक्षण कार्यक्रम',
      description: 'Free skill development training in tailoring, computer basics, and mobile repairing will be conducted for unemployed youth. Registration starts from February 25th.',
      descriptionMr: 'बेरोजगार तरुणांसाठी शिवणकाम, संगणक मूलभूत आणि मोबाईल दुरुस्ती यामध्ये मोफत कौशल्य विकास प्रशिक्षण दिले जाईल. नोंदणी २५ फेब्रुवारीपासून सुरू होईल.',
      category: 'Employment',
      priority: 'normal' as const,
      date: '2024-02-05',
    },
  ];

  const filteredAnnouncements = filter === 'all' 
    ? announcements 
    : announcements.filter(a => a.priority === filter);

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

          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="text-center mb-16 animate-slide-up">
              <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 backdrop-blur-sm shadow-lg">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
                  {t('Latest Updates', 'ताजी माहिती')}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                {t('Announcements', 'घोषणा')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('Stay updated with latest news and notices from Gram Panchayat', 'ग्रामपंचायतीच्या ताज्या बातम्या आणि सूचनांसह अद्यतनित रहा')}
              </p>
            </div>
          </div>
        </section>

        {/* Announcements Section */}
        <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto px-4 max-w-5xl">
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
              {filteredAnnouncements.map((announcement, index) => (
                <AnnouncementCard key={index} {...announcement} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
