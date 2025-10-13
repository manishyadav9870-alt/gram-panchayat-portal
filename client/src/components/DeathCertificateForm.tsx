import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Download } from 'lucide-react';
import { generateDeathCertificatePDF } from '@/utils/pdfGenerator';

const formSchema = z.object({
  deceasedName: z.string().min(2, 'Deceased name is required'),
  dateOfDeath: z.string().min(1, 'Date of death is required'),
  placeOfDeath: z.string().min(2, 'Place of death is required'),
  age: z.string().min(1, 'Age is required'),
  causeOfDeath: z.string().min(2, 'Cause of death is required'),
  applicantName: z.string().min(2, 'Applicant name is required'),
  relation: z.string().min(2, 'Relation is required'),
  contact: z.string().min(10, 'Contact number is required'),
  address: z.string().min(5, 'Address is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function DeathCertificateForm() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [formData, setFormData] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deceasedName: '',
      dateOfDeath: '',
      placeOfDeath: '',
      age: '',
      causeOfDeath: '',
      applicantName: '',
      relation: '',
      contact: '',
      address: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Death certificate application submitted:', data);
    const tracking = `DTH${Date.now().toString().slice(-8)}`;
    setTrackingNumber(tracking);
    setFormData(data);
    setSubmitted(true);
  };

  const handleDownloadPDF = () => {
    if (formData && trackingNumber) {
      generateDeathCertificatePDF({
        trackingNumber,
        ...formData,
      });
    }
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-chart-2">
            {t('Application Submitted Successfully!', 'अर्ज यशस्वीरित्या सबमिट झाला!')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {t('Your tracking number is:', 'तुमचा ट्रॅकिंग क्रमांक आहे:')}
          </p>
          <div className="text-3xl font-bold text-primary" data-testid="text-tracking-number">
            {trackingNumber}
          </div>
          <p className="text-sm text-muted-foreground">
            {t('Please save this number to track your application.', 'कृपया हा क्रमांक जतन करा आणि आपल्या अर्जाचा मागोवा घ्या.')}
          </p>
          <div className="flex gap-3">
            <Button onClick={handleDownloadPDF} variant="default" data-testid="button-download-pdf">
              <Download className="h-4 w-4 mr-2" />
              {t('Download PDF', 'PDF डाउनलोड करा')}
            </Button>
            <Button onClick={() => setSubmitted(false)} variant="outline" data-testid="button-submit-another">
              {t('Submit Another Application', 'दुसरा अर्ज सबमिट करा')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t('Death Certificate Application', 'मृत्यू दाखला अर्ज')}</CardTitle>
        <CardDescription>
          {t('Apply for a death certificate. Please provide accurate information.', 'मृत्यू दाखल्यासाठी अर्ज करा. कृपया अचूक माहिती द्या.')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="deceasedName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Deceased Full Name', 'मृत व्यक्तीचे पूर्ण नाव')} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Enter name', 'नाव टाका')} {...field} data-testid="input-deceased-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfDeath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Date of Death', 'मृत्यू तारीख')} *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} data-testid="input-dod" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="placeOfDeath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Place of Death', 'मृत्यू स्थळ')} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Enter place', 'स्थळ टाका')} {...field} data-testid="input-place-death" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Age at Death', 'मृत्यूच्या वेळी वय')} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Enter age', 'वय टाका')} {...field} data-testid="input-age" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="causeOfDeath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Cause of Death', 'मृत्यूचे कारण')} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Enter cause', 'कारण टाका')} {...field} data-testid="input-cause" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Applicant Name', 'अर्जदाराचे नाव')} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Your name', 'आपले नाव')} {...field} data-testid="input-applicant-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Relation with Deceased', 'मृत व्यक्तीशी नाते')} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t('e.g., Son, Daughter', 'उदा. मुलगा, मुलगी')} {...field} data-testid="input-relation" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Contact Number', 'संपर्क क्रमांक')} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Enter mobile number', 'मोबाईल नंबर टाका')} {...field} data-testid="input-contact" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Address', 'पत्ता')} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Enter address', 'पत्ता टाका')} {...field} data-testid="input-address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" data-testid="button-submit-application">
              {t('Submit Application', 'अर्ज सबमिट करा')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
