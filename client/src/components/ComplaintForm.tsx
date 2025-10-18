import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Download } from 'lucide-react';
import { generateComplaintReceiptPDF } from '@/utils/pdfGenerator';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  contact: z.string().min(10, 'Contact must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

export default function ComplaintForm() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [formData, setFormData] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contact: '',
      address: '',
      category: '',
      description: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit complaint');
      }

      const result = await response.json();
      setTrackingNumber(result.trackingNumber);
      setFormData(data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Failed to submit complaint. Please try again.');
    }
  };

  const handleDownloadPDF = () => {
    if (formData && trackingNumber) {
      generateComplaintReceiptPDF({
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
            {t('Complaint Submitted Successfully!', 'तक्रार यशस्वीरित्या सबमिट झाली!')}
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
              {t('Download Receipt PDF', 'पावती PDF डाउनलोड करा')}
            </Button>
            <Button onClick={() => setSubmitted(false)} variant="outline" data-testid="button-submit-another">
              {t('Submit Another Complaint', 'दुसरी तक्रार सबमिट करा')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t('File a Complaint', 'तक्रार नोंदवा')}</CardTitle>
        <CardDescription>
          {t('Submit your complaint and we will address it promptly.', 'आपली तक्रार सबमिट करा आणि आम्ही लवकरच त्यावर कार्यवाही करू.')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Full Name', 'पूर्ण नाव')} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Enter your name', 'आपले नाव टाका')} {...field} data-testid="input-name" />
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
                    <Input placeholder={t('Enter your address', 'आपला पत्ता टाका')} {...field} data-testid="input-address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Category', 'प्रकार')} *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder={t('Select category', 'प्रकार निवडा')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="water">{t('Water Supply', 'पाणी पुरवठा')}</SelectItem>
                      <SelectItem value="electricity">{t('Electricity', 'वीज')}</SelectItem>
                      <SelectItem value="roads">{t('Roads', 'रस्ते')}</SelectItem>
                      <SelectItem value="drainage">{t('Drainage', 'गटार')}</SelectItem>
                      <SelectItem value="other">{t('Other', 'इतर')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Description', 'तपशील')} *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('Describe your complaint in detail', 'आपली तक्रार तपशीलवार लिहा')} 
                      {...field} 
                      data-testid="input-description"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" data-testid="button-submit-complaint">
              {t('Submit Complaint', 'तक्रार सबमिट करा')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
