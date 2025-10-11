import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementCard from '@/components/AnnouncementCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
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
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              {t('Announcements', 'घोषणा')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('Stay updated with latest news and notices from Gram Panchayat', 'ग्रामपंचायतीच्या ताज्या बातम्या आणि सूचनांसह अद्यतनित रहा')}
            </p>
          </div>

          <div className="flex gap-2 mb-6">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('all')}
              data-testid="button-filter-all"
            >
              <Filter className="h-4 w-4 mr-2" />
              {t('All', 'सर्व')}
            </Button>
            <Button 
              variant={filter === 'high' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('high')}
              data-testid="button-filter-important"
            >
              {t('Important', 'महत्वाचे')}
            </Button>
            <Button 
              variant={filter === 'normal' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('normal')}
              data-testid="button-filter-normal"
            >
              {t('General', 'सामान्य')}
            </Button>
          </div>

          <div className="space-y-4">
            {filteredAnnouncements.map((announcement, index) => (
              <AnnouncementCard key={index} {...announcement} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
