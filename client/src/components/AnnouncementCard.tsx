import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Megaphone } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface AnnouncementCardProps {
  title: string;
  titleMr: string;
  description: string;
  descriptionMr: string;
  category: string;
  priority: 'high' | 'normal';
  date: string;
}

export default function AnnouncementCard({ 
  title, 
  titleMr, 
  description, 
  descriptionMr, 
  category, 
  priority, 
  date 
}: AnnouncementCardProps) {
  const { t, language } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const displayTitle = language === 'en' ? title : titleMr;
  const displayDescription = language === 'en' ? description : descriptionMr;

  return (
    <Card className={`${priority === 'high' ? 'border-l-4 border-l-chart-4' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${priority === 'high' ? 'bg-chart-4/10' : 'bg-primary/10'}`}>
              <Megaphone className={`h-5 w-5 ${priority === 'high' ? 'text-chart-4' : 'text-primary'}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">{displayTitle}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {category}
                </Badge>
                {priority === 'high' && (
                  <Badge className="text-xs bg-chart-4 text-white">
                    {t('Important', 'महत्वाचे')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{date}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className={`text-muted-foreground ${!expanded && 'line-clamp-2'}`}>
          {displayDescription}
        </p>
        {displayDescription.length > 150 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="mt-2 h-auto p-0 text-primary hover:bg-transparent"
            data-testid="button-toggle-announcement"
          >
            {expanded ? t('Show Less', 'कमी दाखवा') : t('Read More', 'अधिक वाचा')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
