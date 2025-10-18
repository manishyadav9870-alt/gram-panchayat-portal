import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Download, Upload, Save, FileText, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  // Certificate Information
  certificateNo: z.string().optional(),
  localBodyName: z.string().min(2, 'Local body name is required'),
  
  // Aadhaar Card Number
  aadharNumber: z.string().optional(),
  
  // Child Information
  childName: z.string().min(2, 'Child name is required'),
  childNameMarathi: z.string().optional(),
  sex: z.enum(['Male', 'Female', 'Other'], { required_error: 'Sex is required' }),
  
  // Birth Details
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  placeOfBirth: z.string().min(2, 'Place of birth is required'),
  placeOfBirthMarathi: z.string().optional(),
  
  // Mother Information
  motherName: z.string().min(2, 'Mother name is required'),
  motherNameMarathi: z.string().optional(),
  
  // Father Information
  fatherName: z.string().min(2, 'Father name is required'),
  fatherNameMarathi: z.string().optional(),
  
  // Address Information
  addressAtBirth: z.string().min(5, 'Address at time of birth is required'),
  addressAtBirthMarathi: z.string().optional(),
  permanentAddress: z.string().min(5, 'Permanent address is required'),
  permanentAddressMarathi: z.string().optional(),
  
  // Registration Information
  registrationNo: z.string().optional(),
  dateOfRegistration: z.string().optional(),
  
  // Remarks
  remarks: z.string().optional(),
  
  // Contact
  contact: z.string().min(10, 'Contact number is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function BirthCertificateFormEnhanced() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [certificateId, setCertificateId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      certificateNo: '',
      localBodyName: 'Kishore Gram Panchayat',
      aadharNumber: '',
      childName: '',
      childNameMarathi: '',
      sex: undefined,
      dateOfBirth: '',
      placeOfBirth: '',
      placeOfBirthMarathi: '',
      motherName: '',
      motherNameMarathi: '',
      fatherName: '',
      fatherNameMarathi: '',
      addressAtBirth: '',
      addressAtBirthMarathi: '',
      permanentAddress: '',
      permanentAddressMarathi: '',
      registrationNo: '',
      dateOfRegistration: '',
      remarks: '',
      contact: '',
    },
  });

  const handleOCRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid File',
        description: 'Please upload a PDF file',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('/api/ocr/birth-certificate', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.parsedData) {
        // Auto-fill form with OCR data
        const parsed = result.parsedData;
        
        if (parsed.nameOfChild) form.setValue('childName', parsed.nameOfChild);
        if (parsed.dateOfBirth) form.setValue('dateOfBirth', parsed.dateOfBirth);
        if (parsed.placeOfBirth) form.setValue('placeOfBirth', parsed.placeOfBirth);
        if (parsed.motherName) form.setValue('motherName', parsed.motherName);
        if (parsed.fatherName) form.setValue('fatherName', parsed.fatherName);
        if (parsed.registrationNo) form.setValue('registrationNo', parsed.registrationNo);
        if (parsed.certificateNo) form.setValue('certificateNo', parsed.certificateNo);

        toast({
          title: 'Success',
          description: 'Form auto-filled with OCR data. Please verify all fields.',
        });
      } else {
        toast({
          title: 'OCR Failed',
          description: result.error || 'Could not extract data from PDF',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const response = await fetch('/api/birth-certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit birth certificate application');
      }

      const result = await response.json();
      setTrackingNumber(result.trackingNumber);
      setCertificateId(result.id);
      setSubmitted(true);
      
      toast({
        title: 'Success',
        description: 'Birth certificate application submitted successfully',
      });
    } catch (error) {
      console.error('Error submitting birth certificate application:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!certificateId) return;

    try {
      const response = await fetch(`/api/birth-certificates/${certificateId}/pdf`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `birth-certificate-${trackingNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Success',
        description: 'PDF downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download PDF. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (submitted) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-green-600 flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6" />
            {t('Application Submitted Successfully!', 'अर्ज यशस्वीरित्या सबमिट झाला!')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-muted p-6 rounded-lg">
            <p className="text-muted-foreground mb-2">
              {t('Your tracking number is:', 'तुमचा ट्रॅकिंग क्रमांक आहे:')}
            </p>
            <div className="text-4xl font-bold text-primary">
              {trackingNumber}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {t('Please save this number to track your application.', 'कृपया हा क्रमांक जतन करा आणि आपल्या अर्जाचा मागोवा घ्या.')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleDownloadPDF} size="lg" className="gap-2">
              <Download className="h-5 w-5" />
              {t('Download PDF Certificate', 'PDF प्रमाणपत्र डाउनलोड करा')}
            </Button>
            <Button onClick={() => setSubmitted(false)} variant="outline" size="lg">
              {t('Submit Another Application', 'दुसरा अर्ज सबमिट करा')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* OCR Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t('Upload Existing Certificate (Optional)', 'विद्यमान प्रमाणपत्र अपलोड करा (पर्यायी)')}
          </CardTitle>
          <CardDescription>
            {t('Upload a PDF of an existing birth certificate to auto-fill the form', 'फॉर्म स्वयंचलितपणे भरण्यासाठी विद्यमान जन्म प्रमाणपत्राचा PDF अपलोड करा')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="application/pdf"
              onChange={handleOCRUpload}
              disabled={uploading}
              className="flex-1"
            />
            {uploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('Birth Certificate Application Form', 'जन्म प्रमाणपत्र अर्ज फॉर्म')}
          </CardTitle>
          <CardDescription>
            {t('Fill in all required fields marked with *', 'सर्व आवश्यक फील्ड * सह चिन्हांकित भरा')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Certificate Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {t('Certificate Information', 'प्रमाणपत्र माहिती')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="certificateNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Certificate No.', 'प्रमाणपत्र क्र.')}</FormLabel>
                        <FormControl>
                          <Input placeholder="Form 4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="localBodyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Local Body Name', 'स्थानिक संस्थेचे नाव')} *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="aadharNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Aadhaar Card Number', 'आधार कार्ड क्रमांक')}</FormLabel>
                      <FormControl>
                        <Input placeholder="XXXX-XXXX-XXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Child Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {t('Child Information', 'बालकाची माहिती')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="childName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Name of Child (English)', 'बालकाचे नाव (इंग्रजी)')} *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter child name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="childNameMarathi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Name of Child (Marathi)', 'बालकाचे नाव (मराठी)')}</FormLabel>
                        <FormControl>
                          <Input placeholder="बालकाचे नाव टाका" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Sex', 'लिंग')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('Select sex', 'लिंग निवडा')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">{t('Male', 'पुरुष')}</SelectItem>
                          <SelectItem value="Female">{t('Female', 'स्त्री')}</SelectItem>
                          <SelectItem value="Other">{t('Other', 'इतर')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Birth Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {t('Birth Details', 'जन्म तपशील')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Date of Birth', 'जन्म तारीख')} *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                        <FormLabel>{t('Place of Birth (English)', 'जन्म स्थळ (इंग्रजी)')} *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter place of birth" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="placeOfBirthMarathi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Place of Birth (Marathi)', 'जन्म स्थळ (मराठी)')}</FormLabel>
                        <FormControl>
                          <Input placeholder="जन्म स्थळ टाका" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Parent Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {t('Parent Information', 'पालकांची माहिती')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="motherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Full Name of Mother (English)', 'आईचे पूर्ण नाव (इंग्रजी)')} *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter mother's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motherNameMarathi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Full Name of Mother (Marathi)', 'आईचे पूर्ण नाव (मराठी)')}</FormLabel>
                        <FormControl>
                          <Input placeholder="आईचे पूर्ण नाव टाका" {...field} />
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
                        <FormLabel>{t('Full Name of Father (English)', 'वडिलांचे पूर्ण नाव (इंग्रजी)')} *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter father's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fatherNameMarathi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Full Name of Father (Marathi)', 'वडिलांचे पूर्ण नाव (मराठी)')}</FormLabel>
                        <FormControl>
                          <Input placeholder="वडिलांचे पूर्ण नाव टाका" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {t('Address Information', 'पत्ता माहिती')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="addressAtBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Address at Time of Birth (English)', 'जन्माच्या वेळचा पत्ता (इंग्रजी)')} *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter address" {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressAtBirthMarathi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Address at Time of Birth (Marathi)', 'जन्माच्या वेळचा पत्ता (मराठी)')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder="पत्ता टाका" {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Permanent Address (English)', 'कायमचा पत्ता (इंग्रजी)')} *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter permanent address" {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentAddressMarathi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Permanent Address (Marathi)', 'कायमचा पत्ता (मराठी)')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder="कायमचा पत्ता टाका" {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Registration Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {t('Registration Information', 'नोंदणी माहिती')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="registrationNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Registration No.', 'नोंदणी क्रमांक')}</FormLabel>
                        <FormControl>
                          <Input placeholder="Auto-generated" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfRegistration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Date of Registration', 'नोंदणी दिनांक')}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Remarks (if any)', 'शेरा (असल्यास)')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('Enter any remarks', 'कोणतीही टिप्पणी टाका')} {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {t('Contact Information', 'संपर्क माहिती')}
                </h3>
                
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Contact Number', 'संपर्क क्रमांक')} *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1 gap-2" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('Saving...', 'जतन करत आहे...')}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {t('Save & Submit Application', 'जतन करा आणि अर्ज सबमिट करा')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
