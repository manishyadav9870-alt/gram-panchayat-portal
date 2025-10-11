import AnnouncementCard from '../AnnouncementCard';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function AnnouncementCardExample() {
  return (
    <LanguageProvider>
      <div className="p-6 max-w-2xl space-y-4">
        <AnnouncementCard
          title="Property Tax Payment Deadline Extended"
          titleMr="मालमत्ता कर भरण्याची अंतिम मुदत वाढवली"
          description="The deadline for property tax payment has been extended to March 31st. Late fee waiver available for early payment."
          descriptionMr="मालमत्ता कर भरण्याची अंतिम मुदत ३१ मार्चपर्यंत वाढवण्यात आली आहे. लवकर भरणा केल्यास विलंब शुल्क माफी उपलब्ध."
          category="Tax"
          priority="high"
          date="2024-02-15"
        />
        <AnnouncementCard
          title="Vaccination Drive Next Week"
          titleMr="पुढील आठवड्यात लसीकरण मोहीम"
          description="A free vaccination drive will be conducted at the village community center from February 20-22."
          descriptionMr="गाव समुदाय केंद्रावर फेब्रुवारी २० ते २२ या कालावधीत मोफत लसीकरण मोहीम राबविली जाईल."
          category="Health"
          priority="normal"
          date="2024-02-10"
        />
      </div>
    </LanguageProvider>
  );
}
