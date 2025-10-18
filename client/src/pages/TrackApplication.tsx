import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/StatusBadge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, User, FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function TrackApplication() {
  const { t } = useLanguage();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSearch = () => {
    //todo: remove mock functionality
    console.log('Searching for:', trackingNumber);
    if (trackingNumber.startsWith('CMP')) {
      setResult({
        type: 'Complaint',
        typeMr: 'तक्रार',
        trackingNumber,
        name: 'Rahul Sharma',
        category: 'Water Supply',
        categoryMr: 'पाणी पुरवठा',
        date: '2024-02-15',
        status: 'processing' as const,
      });
    } else if (trackingNumber.startsWith('BRT')) {
      setResult({
        type: 'Birth Certificate',
        typeMr: 'जन्म दाखला',
        trackingNumber,
        name: 'Baby Patil',
        date: '2024-02-10',
        status: 'approved' as const,
      });
    } else if (trackingNumber.startsWith('DTH')) {
      setResult({
        type: 'Death Certificate',
        typeMr: 'मृत्यू दाखला',
        trackingNumber,
        name: 'Late Ramesh Deshmukh',
        date: '2024-02-12',
        status: 'pending' as const,
      });
    } else {
      setResult(null);
    }
  };

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

          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <div className="text-center mb-16 animate-slide-up">
              <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 backdrop-blur-sm shadow-lg">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
                  {t('Application Status', 'अर्ज स्थिती')}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                {t('Track Application', 'अर्ज ट्रॅक करा')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('Enter your tracking number to check application status', 'अर्जाची स्थिती तपासण्यासाठी आपला ट्रॅकिंग क्रमांक प्रविष्ट करा')}
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="mb-12 card-modern glass-card border-2 border-white/20 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t('Enter Tracking Number', 'ट्रॅकिंग क्रमांक टाका')}</CardTitle>
                <CardDescription className="text-base">
                  {t('You received this number when you submitted your application', 'तुम्ही अर्ज सबमिट केल्यावर हा क्रमांक मिळाला होता')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder={t('e.g., CMP12345678', 'उदा. CMP12345678')}
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    data-testid="input-tracking-number"
                    className="text-lg py-6 rounded-xl"
                  />
                  <Button onClick={handleSearch} data-testid="button-search" size="lg" className="rounded-xl px-8">
                    <Search className="h-5 w-5 mr-2" />
                    {t('Search', 'शोधा')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {result && (
              <Card className="card-modern glass-card border-2 border-white/20 rounded-3xl">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <CardTitle className="text-2xl font-bold">{t('Application Details', 'अर्ज तपशील')}</CardTitle>
                    <StatusBadge status={result.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('Application Type', 'अर्ज प्रकार')}</p>
                    <p className="font-semibold" data-testid="text-application-type">
                      {t(result.type, result.typeMr)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('Tracking Number', 'ट्रॅकिंग क्रमांक')}</p>
                    <p className="font-semibold font-mono" data-testid="text-tracking-result">
                      {result.trackingNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('Applicant Name', 'अर्जदाराचे नाव')}</p>
                    <p className="font-semibold" data-testid="text-applicant-name">
                      {result.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('Submission Date', 'सबमिशन तारीख')}</p>
                    <p className="font-semibold" data-testid="text-submission-date">
                      {result.date}
                    </p>
                  </div>
                </div>

                {result.category && (
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('Category', 'प्रकार')}</p>
                      <p className="font-semibold">
                        {t(result.category, result.categoryMr)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    {result.status === 'pending' && t(
                      'Your application is under review. You will be notified once processed.',
                      'तुमचा अर्ज पुनरावलोकनाधीन आहे. प्रक्रिया झाल्यावर तुम्हाला सूचित केले जाईल.'
                    )}
                    {result.status === 'processing' && t(
                      'Your application is being processed. Expected completion in 3-5 business days.',
                      'तुमच्या अर्जावर प्रक्रिया सुरू आहे. ३-५ कामकाजाच्या दिवसांत पूर्ण होण्याची अपेक्षा आहे.'
                    )}
                    {result.status === 'approved' && t(
                      'Your application has been approved. You can collect the certificate from the office.',
                      'तुमचा अर्ज मंजूर झाला आहे. तुम्ही कार्यालयातून प्रमाणपत्र गोळा करू शकता.'
                    )}
                    {result.status === 'rejected' && t(
                      'Your application has been rejected. Please contact the office for more details.',
                      'तुमचा अर्ज नाकारण्यात आला आहे. अधिक माहितीसाठी कृपया कार्यालयाशी संपर्क साधा.'
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
