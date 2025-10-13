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
import { generateBirthCertificatePDF } from '@/utils/pdfGenerator';

const formSchema = z.object({
  childName: z.string().min(2, 'Child name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  placeOfBirth: z.string().min(2, 'Place of birth is required'),
  fatherName: z.string().min(2, 'Father name is required'),
  motherName: z.string().min(2, 'Mother name is required'),
  address: z.string().min(5, 'Address is required'),
  contact: z.string().min(10, 'Contact number is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function BirthCertificateForm() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [formData, setFormData] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      childName: '',
      dateOfBirth: '',
      placeOfBirth: '',
      fatherName: '',
      motherName: '',
      address: '',
      contact: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Birth certificate application submitted:', data);
    const tracking = `BRT${Date.now().toString().slice(-8)}`;
    setTrackingNumber(tracking);
    setFormData(data);
    setSubmitted(true);
  };

  const handleDownloadPDF = () => {
    if (formData && trackingNumber) {
      generateBirthCertificatePDF({
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
        <CardTitle>{t('Birth Certificate Application', 'जन्म दाखला अर्ज')}</CardTitle>
        <CardDescription>
          {t('Apply for a birth certificate. Please provide accurate information.', 'जन्म दाखल्यासाठी अर्ज करा. कृपया अचूक माहिती द्या.')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="childName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Child Full Name', 'बालकाचे पूर्ण नाव')} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Enter child name', 'बालकाचे नाव टाका')} {...field} data-testid="input-child-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Date of Birth', 'जन्म तारीख')} *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} data-testid="input-dob" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="placeOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Place of Birth', 'जन्म स्थळ')} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Enter place of birth', 'जन्म स्थळ टाका')} {...field} data-testid="input-place-birth" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fatherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Father Name', 'वडिलांचे नाव')} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Enter father name', 'वडिलांचे नाव टाका')} {...field} data-testid="input-father-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Mother Name', 'आईचे नाव')} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Enter mother name', 'आईचे नाव टाका')} {...field} data-testid="input-mother-name" />
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

            <Button type="submit" className="w-full" data-testid="button-submit-application">
              {t('Submit Application', 'अर्ज सबमिट करा')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
