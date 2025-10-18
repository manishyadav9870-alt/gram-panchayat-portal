import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';

export default function Records() {
  const { t } = useLanguage();

  // Mock data for demonstration
  const birthRecords = [
    {
      id: 'BRT12345678',
      childName: 'Raj Sharma',
      dateOfBirth: '2024-01-15',
      fatherName: 'Ramesh Sharma',
      status: 'approved',
      submittedDate: '2024-01-20',
    },
    {
      id: 'BRT87654321',
      childName: 'Priya Patil',
      dateOfBirth: '2024-02-10',
      fatherName: 'Suresh Patil',
      status: 'pending',
      submittedDate: '2024-02-15',
    },
    {
      id: 'BRT11223344',
      childName: 'Arjun Deshmukh',
      dateOfBirth: '2024-03-05',
      fatherName: 'Vijay Deshmukh',
      status: 'processing',
      submittedDate: '2024-03-08',
    },
  ];

  const deathRecords = [
    {
      id: 'DTH98765432',
      deceasedName: 'Late Ramesh Kumar',
      dateOfDeath: '2024-01-10',
      applicantName: 'Suresh Kumar',
      status: 'approved',
      submittedDate: '2024-01-12',
    },
    {
      id: 'DTH55667788',
      deceasedName: 'Late Savita Devi',
      dateOfDeath: '2024-02-20',
      applicantName: 'Rajesh Devi',
      status: 'pending',
      submittedDate: '2024-02-22',
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; labelEn: string; labelMr: string }> = {
      approved: { variant: 'default', labelEn: 'Approved', labelMr: 'मंजूर' },
      pending: { variant: 'secondary', labelEn: 'Pending', labelMr: 'प्रलंबित' },
      processing: { variant: 'outline', labelEn: 'Processing', labelMr: 'प्रक्रियाधीन' },
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} className="font-semibold">
        {t(config.labelEn, config.labelMr)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen flex flex-col gradient-mesh">
      <Header />
      <main className="flex-1 py-12 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-chart-3/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <span className="text-sm font-semibold text-primary">
                {t('Registration Records', 'नोंदणी रेकॉर्ड')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              {t('Birth & Death Records', 'जन्म व मृत्यू नोंदी')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('View all registered birth and death certificates', 'सर्व नोंदणीकृत जन्म आणि मृत्यू प्रमाणपत्रे पहा')}
            </p>
          </div>

          <Card className="glass-card border-2 border-white/20 rounded-2xl">
            <Tabs defaultValue="birth" className="w-full">
              <CardHeader>
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 rounded-xl">
                  <TabsTrigger value="birth" className="rounded-lg">
                    {t('Birth Certificates', 'जन्म दाखले')}
                  </TabsTrigger>
                  <TabsTrigger value="death" className="rounded-lg">
                    {t('Death Certificates', 'मृत्यू दाखले')}
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent>
                <TabsContent value="birth" className="mt-0">
                  <div className="rounded-xl border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-bold">{t('Certificate No.', 'प्रमाणपत्र क्र.')}</TableHead>
                          <TableHead className="font-bold">{t('Child Name', 'बालाचे नाव')}</TableHead>
                          <TableHead className="font-bold">{t('Date of Birth', 'जन्म तारीख')}</TableHead>
                          <TableHead className="font-bold">{t('Father Name', 'वडिलांचे नाव')}</TableHead>
                          <TableHead className="font-bold">{t('Submitted', 'सबमिट केले')}</TableHead>
                          <TableHead className="font-bold">{t('Status', 'स्थिती')}</TableHead>
                          <TableHead className="font-bold text-right">{t('Actions', 'क्रिया')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {birthRecords.map((record) => (
                          <TableRow key={record.id} className="hover:bg-primary/5 transition-colors">
                            <TableCell className="font-mono font-semibold">{record.id}</TableCell>
                            <TableCell className="font-medium">{record.childName}</TableCell>
                            <TableCell>{record.dateOfBirth}</TableCell>
                            <TableCell>{record.fatherName}</TableCell>
                            <TableCell>{record.submittedDate}</TableCell>
                            <TableCell>{getStatusBadge(record.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="outline" className="rounded-lg">
                                  <Eye className="h-4 w-4 mr-1" />
                                  {t('View', 'पहा')}
                                </Button>
                                {record.status === 'approved' && (
                                  <Button size="sm" className="rounded-lg btn-futuristic text-white">
                                    <Download className="h-4 w-4 mr-1" />
                                    {t('Download', 'डाउनलोड')}
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {birthRecords.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {t('No birth records found', 'कोणतेही जन्म रेकॉर्ड आढळले नाहीत')}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="death" className="mt-0">
                  <div className="rounded-xl border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-bold">{t('Certificate No.', 'प्रमाणपत्र क्र.')}</TableHead>
                          <TableHead className="font-bold">{t('Deceased Name', 'मृताचे नाव')}</TableHead>
                          <TableHead className="font-bold">{t('Date of Death', 'मृत्यू तारीख')}</TableHead>
                          <TableHead className="font-bold">{t('Applicant', 'अर्जदार')}</TableHead>
                          <TableHead className="font-bold">{t('Submitted', 'सबमिट केले')}</TableHead>
                          <TableHead className="font-bold">{t('Status', 'स्थिती')}</TableHead>
                          <TableHead className="font-bold text-right">{t('Actions', 'क्रिया')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deathRecords.map((record) => (
                          <TableRow key={record.id} className="hover:bg-primary/5 transition-colors">
                            <TableCell className="font-mono font-semibold">{record.id}</TableCell>
                            <TableCell className="font-medium">{record.deceasedName}</TableCell>
                            <TableCell>{record.dateOfDeath}</TableCell>
                            <TableCell>{record.applicantName}</TableCell>
                            <TableCell>{record.submittedDate}</TableCell>
                            <TableCell>{getStatusBadge(record.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="outline" className="rounded-lg">
                                  <Eye className="h-4 w-4 mr-1" />
                                  {t('View', 'पहा')}
                                </Button>
                                {record.status === 'approved' && (
                                  <Button size="sm" className="rounded-lg btn-futuristic text-white">
                                    <Download className="h-4 w-4 mr-1" />
                                    {t('Download', 'डाउनलोड')}
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {deathRecords.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {t('No death records found', 'कोणतेही मृत्यू रेकॉर्ड आढळले नाहीत')}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
