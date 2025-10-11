import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, FileCheck } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();

  const stats = [
    { 
      icon: FileCheck, 
      labelEn: 'Applications Processed', 
      labelMr: 'प्रक्रिया केलेले अर्ज', 
      value: '1,200+',
      color: 'text-chart-1'
    },
    { 
      icon: Users, 
      labelEn: 'Citizens Served', 
      labelMr: 'सेवा दिलेले नागरिक', 
      value: '5,000+',
      color: 'text-chart-2'
    },
    { 
      icon: TrendingUp, 
      labelEn: 'Success Rate', 
      labelMr: 'यश दर', 
      value: '98%',
      color: 'text-chart-3'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t('Our Impact', 'आमचा प्रभाव')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-8 w-8 ${stat.color}`} />
                        <CardTitle className="text-lg">{t(stat.labelEn, stat.labelMr)}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold" data-testid={`text-stat-${index}`}>{stat.value}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
