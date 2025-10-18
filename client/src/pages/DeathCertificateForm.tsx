import { useState } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skull, User, MapPin, Info, ArrowLeft, Save, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DeathCertificateForm() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    certificateNumber: 'DC-2025-0002',
    registrationNumber: '',
    deceasedNameEn: '',
    deceasedNameMr: '',
    sex: '',
    dateOfDeath: '',
    ageAtDeath: '',
    placeOfDeathEn: '',
    placeOfDeathMr: '',
    aadharNumber: '',
    dateOfRegistration: new Date().toISOString().split('T')[0],
    motherNameEn: '',
    motherNameMr: '',
    fatherHusbandNameEn: '',
    fatherHusbandNameMr: '',
    permanentAddressEn: '',
    permanentAddressMr: '',
    deathAddress: '',
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
      const response = await fetch('/api/death-certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: t('Success', 'यशस्वी'),
          description: t('Death certificate saved successfully', 'मृत्यू प्रमाणपत्र यशस्वीरित्या जतन केले')
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
      <div className="bg-red-600 text-white p-6 print:hidden">
        <div className="container mx-auto">
          <div className="flex items-center gap-3">
            <Skull className="h-8 w-8" />
            <h1 className="text-3xl font-bold">
              {t('Death Certificate Registration', 'मृत्यू प्रमाणपत्र नोंदणी')}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Certificate Information */}
        <Card className="mb-6">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Skull className="h-5 w-5" />
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

        {/* Deceased Information */}
        <Card className="mb-6">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <User className="h-5 w-5" />
              {t('Deceased Information', 'मृत व्यक्तीची माहिती')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="deceasedNameEn">
                  {t('Name of Deceased (English)', 'मृत व्यक्तीचे नाव (इंग्रजी)')}
                </Label>
                <Input
                  id="deceasedNameEn"
                  value={formData.deceasedNameEn}
                  onChange={(e) => handleChange('deceasedNameEn', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="deceasedNameMr">
                  {t('Name of Deceased (Marathi)', 'मृत व्यक्तीचे नाव (मराठी)')}
                  <span className="text-xs text-muted-foreground ml-2">
                    ✏️ {t('Auto-transliteration enabled', 'स्वयं-लिप्यंतरण सक्षम')}
                  </span>
                </Label>
                <Input
                  id="deceasedNameMr"
                  value={formData.deceasedNameMr}
                  onChange={(e) => handleChange('deceasedNameMr', e.target.value)}
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
                <Label htmlFor="dateOfDeath">{t('Date of Death', 'मृत्यू तारीख')}</Label>
                <Input
                  id="dateOfDeath"
                  type="date"
                  value={formData.dateOfDeath}
                  onChange={(e) => handleChange('dateOfDeath', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="ageAtDeath">{t('Age at Death', 'मृत्यूच्या वेळी वय')}</Label>
                <Input
                  id="ageAtDeath"
                  type="number"
                  placeholder={t('Enter age in years', 'वर्षांमध्ये वय टाका')}
                  value={formData.ageAtDeath}
                  onChange={(e) => handleChange('ageAtDeath', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label htmlFor="placeOfDeathEn">{t('Place of Death (English)', 'मृत्यू स्थान (इंग्रजी)')}</Label>
                <Input
                  id="placeOfDeathEn"
                  value={formData.placeOfDeathEn}
                  onChange={(e) => handleChange('placeOfDeathEn', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="placeOfDeathMr">
                  {t('Place of Death (Marathi)', 'मृत्यू स्थान (मराठी)')}
                  <span className="text-xs text-muted-foreground ml-2">
                    ✏️ {t('Auto-transliteration enabled', 'स्वयं-लिप्यंतरण सक्षम')}
                  </span>
                </Label>
                <Input
                  id="placeOfDeathMr"
                  value={formData.placeOfDeathMr}
                  onChange={(e) => handleChange('placeOfDeathMr', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="aadharNumber">{t('Aadhar Number', 'आधार क्रमांक')}</Label>
                <Input
                  id="aadharNumber"
                  placeholder={t('Enter 12 digit Aadhar number', '12 अंकी आधार क्रमांक टाका')}
                  value={formData.aadharNumber}
                  onChange={(e) => handleChange('aadharNumber', e.target.value)}
                  maxLength={12}
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
          </CardContent>
        </Card>

        {/* Mother's Information */}
        <Card className="mb-6">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-700">
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
            </div>
          </CardContent>
        </Card>

        {/* Father's/Husband's Information */}
        <Card className="mb-6">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <User className="h-5 w-5" />
              {t("Father's/Husband's Information", 'वडील/पतीची माहिती')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fatherHusbandNameEn">{t("Father's/Husband's Full Name (English)", 'वडील/पतीचे पूर्ण नाव (इंग्रजी)')}</Label>
                <Input
                  id="fatherHusbandNameEn"
                  value={formData.fatherHusbandNameEn}
                  onChange={(e) => handleChange('fatherHusbandNameEn', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="fatherHusbandNameMr">
                  {t("Father's/Husband's Full Name (Marathi)", 'वडील/पतीचे पूर्ण नाव (मराठी)')}
                  <span className="text-xs text-muted-foreground ml-2">
                    ✏️ {t('Auto-transliteration enabled', 'स्वयं-लिप्यंतरण सक्षम')}
                  </span>
                </Label>
                <Input
                  id="fatherHusbandNameMr"
                  value={formData.fatherHusbandNameMr}
                  onChange={(e) => handleChange('fatherHusbandNameMr', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="mb-6">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-700">
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
                <Label htmlFor="deathAddress">{t('Address at Time of Death (if different)', 'मृत्यूच्या वेळचा पत्ता (वेगळा असल्यास)')}</Label>
                <Textarea
                  id="deathAddress"
                  value={formData.deathAddress}
                  onChange={(e) => handleChange('deathAddress', e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="mb-6">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-700">
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
              className="bg-red-600 hover:bg-red-700 gap-2"
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
