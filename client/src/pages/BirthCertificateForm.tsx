import { useState } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Baby, User, MapPin, Info, ArrowLeft, Save, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BirthCertificateForm() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    certificateNumber: 'BC-2025-0001',
    registrationNumber: '',
    childNameEn: '',
    childNameMr: '',
    sex: '',
    dateOfBirth: '',
    dateOfRegistration: new Date().toISOString().split('T')[0],
    placeOfBirthEn: '',
    placeOfBirthMr: '',
    motherNameEn: '',
    motherNameMr: '',
    motherAadhar: '',
    fatherNameEn: '',
    fatherNameMr: '',
    fatherAadhar: '',
    permanentAddressEn: '',
    permanentAddressMr: '',
    birthAddress: '',
    issueDate: new Date().toISOString().split('T')[0],
    issuingAuthority: 'ग्रामपंचायत किशोर',
    remarksEn: '',
    remarksMr: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/birth-certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: t('Success', 'यशस्वी'),
          description: t('Birth certificate saved successfully', 'जन्म प्रमाणपत्र यशस्वीरित्या जतन केले')
        });
        setLocation('/admin/dashboard');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: t('Error', 'त्रुटी'),
        description: t('Failed to save certificate', 'प्रमाणपत्र जतन करण्यात अयशस्वी'),
        variant: 'destructive'
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 print:hidden">
        <div className="container mx-auto">
          <div className="flex items-center gap-3">
            <Baby className="h-8 w-8" />
            <h1 className="text-3xl font-bold">
              {t('Birth Certificate Registration', 'जन्म प्रमाणपत्र नोंदणी')}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Certificate Information */}
        <Card className="mb-6">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Baby className="h-5 w-5" />
              {t('Certificate Information', 'प्रमाणपत्र माहिती')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="certificateNumber">
                  {t('Certificate Number', 'प्रमाणपत्र क्रमांक')}
                </Label>
                <Input
                  id="certificateNumber"
                  value={formData.certificateNumber}
                  onChange={(e) => handleChange('certificateNumber', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="registrationNumber">
                  {t('Registration Number', 'नोंदणी क्रमांक')}
                </Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => handleChange('registrationNumber', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Child Information */}
        <Card className="mb-6">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Baby className="h-5 w-5" />
              {t('Child Information', 'मुलाची माहिती')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="childNameEn">
                  {t('Child Name (English)', 'मुलाचे नाव (इंग्रजी)')}
                </Label>
                <Input
                  id="childNameEn"
                  placeholder={t("Enter child's name in English", "मुलाचे नाव इंग्रजीत टाका")}
                  value={formData.childNameEn}
                  onChange={(e) => handleChange('childNameEn', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="childNameMr">
                  {t('Child Name (Marathi)', 'मुलाचे नाव (मराठी)')}
                  <span className="text-xs text-muted-foreground ml-2">
                    ✏️ {t('Auto-transliteration enabled', 'स्वयं-लिप्यंतरण सक्षम')}
                  </span>
                </Label>
                <Input
                  id="childNameMr"
                  placeholder={t("बालकाचे नाव मराठीत लिहा", "बालकाचे नाव मराठीत लिहा")}
                  value={formData.childNameMr}
                  onChange={(e) => handleChange('childNameMr', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="sex">{t('Sex', 'लिंग')}</Label>
                <Select value={formData.sex} onValueChange={(value) => handleChange('sex', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={t('-- Select --', '-- निवडा --')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('Male', 'पुरुष')}</SelectItem>
                    <SelectItem value="female">{t('Female', 'स्त्री')}</SelectItem>
                    <SelectItem value="other">{t('Other', 'इतर')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateOfBirth">{t('Date of Birth', 'जन्म तारीख')}</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="dateOfRegistration">{t('Date of Registration', 'नोंदणी तारीख')}</Label>
                <Input
                  id="dateOfRegistration"
                  type="date"
                  value={formData.dateOfRegistration}
                  onChange={(e) => handleChange('dateOfRegistration', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label htmlFor="placeOfBirthEn">{t('Place of Birth (English)', 'जन्म स्थान (इंग्रजी)')}</Label>
                <Input
                  id="placeOfBirthEn"
                  value={formData.placeOfBirthEn}
                  onChange={(e) => handleChange('placeOfBirthEn', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="placeOfBirthMr">
                  {t('Place of Birth (Marathi)', 'जन्म स्थान (मराठी)')}
                  <span className="text-xs text-muted-foreground ml-2">
                    ✏️ {t('Auto-transliteration enabled', 'स्वयं-लिप्यंतरण सक्षम')}
                  </span>
                </Label>
                <Input
                  id="placeOfBirthMr"
                  value={formData.placeOfBirthMr}
                  onChange={(e) => handleChange('placeOfBirthMr', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mother's Information */}
        <Card className="mb-6">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <User className="h-5 w-5" />
              {t("Mother's Information", 'आईची माहिती')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="motherNameEn">{t("Mother's Full Name (English)", 'आईचे पूर्ण नाव (इंग्रजी)')}</Label>
                <Input
                  id="motherNameEn"
                  value={formData.motherNameEn}
                  onChange={(e) => handleChange('motherNameEn', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="motherNameMr">
                  {t("Mother's Full Name (Marathi)", 'आईचे पूर्ण नाव (मराठी)')}
                  <span className="text-xs text-muted-foreground ml-2">
                    ✏️ {t('Auto-transliteration enabled', 'स्वयं-लिप्यंतरण सक्षम')}
                  </span>
                </Label>
                <Input
                  id="motherNameMr"
                  value={formData.motherNameMr}
                  onChange={(e) => handleChange('motherNameMr', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="motherAadhar">{t("Mother's Aadhar Number", 'आईचा आधार क्रमांक')}</Label>
                <Input
                  id="motherAadhar"
                  placeholder={t('Enter 12 digit Aadhar number', '12 अंकी आधार क्रमांक टाका')}
                  value={formData.motherAadhar}
                  onChange={(e) => handleChange('motherAadhar', e.target.value)}
                  maxLength={12}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Father's Information */}
        <Card className="mb-6">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <User className="h-5 w-5" />
              {t("Father's Information", 'वडिलांची माहिती')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fatherNameEn">{t("Father's Full Name (English)", 'वडिलांचे पूर्ण नाव (इंग्रजी)')}</Label>
                <Input
                  id="fatherNameEn"
                  value={formData.fatherNameEn}
                  onChange={(e) => handleChange('fatherNameEn', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="fatherNameMr">
                  {t("Father's Full Name (Marathi)", 'वडिलांचे पूर्ण नाव (मराठी)')}
                  <span className="text-xs text-muted-foreground ml-2">
                    ✏️ {t('Auto-transliteration enabled', 'स्वयं-लिप्यंतरण सक्षम')}
                  </span>
                </Label>
                <Input
                  id="fatherNameMr"
                  value={formData.fatherNameMr}
                  onChange={(e) => handleChange('fatherNameMr', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="fatherAadhar">{t("Father's Aadhar Number", 'वडिलांचा आधार क्रमांक')}</Label>
                <Input
                  id="fatherAadhar"
                  placeholder={t('Enter 12 digit Aadhar number', '12 अंकी आधार क्रमांक टाका')}
                  value={formData.fatherAadhar}
                  onChange={(e) => handleChange('fatherAadhar', e.target.value)}
                  maxLength={12}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="mb-6">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <MapPin className="h-5 w-5" />
              {t('Address Information', 'पत्ता माहिती')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="permanentAddressEn">{t('Permanent Address (English)', 'कायमचा पत्ता (इंग्रजी)')}</Label>
                <Textarea
                  id="permanentAddressEn"
                  value={formData.permanentAddressEn}
                  onChange={(e) => handleChange('permanentAddressEn', e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="permanentAddressMr">
                  {t('Permanent Address (Marathi)', 'कायमचा पत्ता (मराठी)')}
                  <span className="text-xs text-muted-foreground ml-2">
                    ✏️ {t('Auto-transliteration enabled', 'स्वयं-लिप्यंतरण सक्षम')}
                  </span>
                </Label>
                <Textarea
                  id="permanentAddressMr"
                  value={formData.permanentAddressMr}
                  onChange={(e) => handleChange('permanentAddressMr', e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="birthAddress">{t('Address at Time of Birth (if different)', 'जन्माच्या वेळचा पत्ता (वेगळा असल्यास)')}</Label>
                <Textarea
                  id="birthAddress"
                  value={formData.birthAddress}
                  onChange={(e) => handleChange('birthAddress', e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="mb-6">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Info className="h-5 w-5" />
              {t('Additional Information', 'अतिरिक्त माहिती')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="issueDate">{t('Certificate Issue Date', 'प्रमाणपत्र जारी तारीख')}</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => handleChange('issueDate', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="issuingAuthority">{t('Issuing Authority', 'जारी करणारी संस्था')}</Label>
                <Input
                  id="issuingAuthority"
                  value={formData.issuingAuthority}
                  onChange={(e) => handleChange('issuingAuthority', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="remarksEn">{t('Remarks (English)', 'शेरा (इंग्रजी)')}</Label>
                <Textarea
                  id="remarksEn"
                  value={formData.remarksEn}
                  onChange={(e) => handleChange('remarksEn', e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="remarksMr">
                  {t('Remarks (Marathi)', 'शेरा (मराठी)')}
                  <span className="text-xs text-muted-foreground ml-2">
                    ✏️ {t('Auto-transliteration enabled', 'स्वयं-लिप्यंतरण सक्षम')}
                  </span>
                </Label>
                <Textarea
                  id="remarksMr"
                  value={formData.remarksMr}
                  onChange={(e) => handleChange('remarksMr', e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 print:hidden">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setLocation('/admin/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            {t('Back to List', 'यादीकडे परत')}
          </Button>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrint}
              className="gap-2"
            >
              <Printer className="h-5 w-5" />
              {t('Print', 'प्रिंट')}
            </Button>
            <Button
              size="lg"
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <Save className="h-5 w-5" />
              {t('Save Certificate', 'प्रमाणपत्र जतन करा')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
