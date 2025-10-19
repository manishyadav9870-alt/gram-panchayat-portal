import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Megaphone, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface AnnouncementCardProps {
  title: string;
  titleMr: string;
  description: string;
  descriptionMr: string;
  category: string;
  priority: 'high' | 'normal' | 'low' | 'urgent';
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

  const priorityConfig = {
    high: { bg: 'from-red-50 to-orange-50', border: 'border-red-200', icon: 'bg-red-500', badge: 'bg-red-500' },
    urgent: { bg: 'from-red-50 to-pink-50', border: 'border-red-300', icon: 'bg-red-600', badge: 'bg-red-600' },
    normal: { bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200', icon: 'bg-blue-500', badge: 'bg-blue-500' },
    low: { bg: 'from-gray-50 to-slate-50', border: 'border-gray-200', icon: 'bg-gray-500', badge: 'bg-gray-500' }
  };
  
  const config = priorityConfig[priority] || priorityConfig.normal;

  return (
    <Card className={`bg-gradient-to-br ${config.bg} border-2 ${config.border} rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${config.icon} text-white shadow-lg`}>
              {priority === 'high' || priority === 'urgent' ? (
                <AlertCircle className="h-7 w-7" />
              ) : (
                <Megaphone className="h-7 w-7" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2 text-gray-900">{displayTitle}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className={`text-xs ${config.badge} text-white border-0 px-3 py-1`}>
                  {category}
                </Badge>
                {(priority === 'high' || priority === 'urgent') && (
                  <Badge className="text-xs bg-red-600 text-white border-0 px-3 py-1 animate-pulse">
                    {t('Important', 'महत्वाचे')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 px-3 py-1.5 rounded-lg">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{date}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-5">
        <div className="bg-white/60 rounded-xl p-4">
          <p className={`text-gray-700 leading-relaxed ${!expanded && 'line-clamp-3'}`}>
          {displayDescription}
        </p>
        {displayDescription.length > 150 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="mt-3 h-auto px-4 py-2 text-orange-600 hover:bg-orange-100 hover:text-orange-700 rounded-lg font-semibold transition-colors"
            data-testid="button-toggle-announcement"
          >
            {expanded ? t('Show Less', 'कमी दाखवा') : t('Read More', 'अधिक वाचा')} →
          </Button>
        )}
        </div>
      </CardContent>
    </Card>
  );
}
