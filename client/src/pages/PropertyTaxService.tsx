import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyPaymentQR from '@/components/PropertyPaymentQR';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Building2, Calendar, IndianRupee, CheckCircle, XCircle, Clock, CreditCard, QrCode, Download, Home, MapPin, User, FileText } from 'lucide-react';

interface PropertyDetails {
  propertyNumber: string;
  ownerName: string;
  ownerNameMr: string;
  address: string;
  addressMr: string;
  areaSqft: number;
  annualTax: number;
  registrationYear: number;
  totalPaid: number;
  totalDue: number;
  status: string;
  payments: Array<{
    year: number;
    amount: number;
    date: string;
    receiptNumber: string;
  }>;
}

export default function PropertyTaxService() {
  const { t, language } = useLanguage();
  const [propertyNumber, setPropertyNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [error, setError] = useState('');
  const [showPaymentQR, setShowPaymentQR] = useState(false);

  const handleSearch = async () => {
    if (!propertyNumber.trim()) {
      setError(t('Please enter property number', 'कृपया मालमत्ता क्रमांक प्रविष्ट करा'));
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/property-tax/${encodeURIComponent(propertyNumber)}`);
      const data = await response.json();
      
      console.log('API Response:', response.status, data);
      
      if (response.ok) {
        setPropertyDetails(data);
      } else {
        setError(data.message || t('Property not found', 'मालमत्ता सापडली नाही'));
        setPropertyDetails(null);
      }
    } catch (err) {
      console.error('Error fetching property:', err);
      setError(t('Failed to fetch property details', 'मालमत्ता तपशील मिळवण्यात अयशस्वी'));
      setPropertyDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearsSinceRegistration = propertyDetails 
    ? currentYear - propertyDetails.registrationYear + 1 
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex justify-end mb-4">
              <Button 
                onClick={() => window.location.href = '/'}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Home className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-white/10 rounded-full mb-4">
                <Building2 className="h-12 w-12" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {t('Property Tax', 'घरपट्टी')}
              </h1>
              <p className="text-lg text-orange-100">
                {t('View property tax details and payment history', 'मालमत्ता कर तपशील आणि भुगतान इतिहास पहा')}
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-orange-600" />
                  {t('Search Property', 'मालमत्ता शोधा')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="propertyNumber">
                      {t('Property Number', 'मालमत्ता क्रमांक')}
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="propertyNumber"
                        placeholder={t('Enter property number (e.g., GP/2025/001)', 'मालमत्ता क्रमांक प्रविष्ट करा (उदा., GP/2025/001)')}
                        value={propertyNumber}
                        onChange={(e) => setPropertyNumber(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {loading ? (
                          t('Searching...', 'शोधत आहे...')
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            {t('Search', 'शोधा')}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            {propertyDetails && (
              <div className="mt-8 space-y-6">
                {/* Owner Details */}
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-orange-600" />
                      {t('Property Details', 'मालमत्ता तपशील')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">{t('Property Number', 'मालमत्ता क्रमांक')}</p>
                          <p className="font-semibold text-lg">{propertyDetails.propertyNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('Owner Name', 'मालकाचे नाव')}</p>
                          <p className="font-semibold">
                            {language === 'mr' ? propertyDetails.ownerNameMr : propertyDetails.ownerName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {t('Address', 'पत्ता')}
                          </p>
                          <p className="font-semibold">
                            {language === 'mr' ? propertyDetails.addressMr : propertyDetails.address}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">{t('Area (sq.ft)', 'क्षेत्रफळ (चौ.फूट)')}</p>
                          <p className="font-semibold">{propertyDetails.areaSqft.toLocaleString()} sq.ft</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('Annual Tax', 'वार्षिक कर')}</p>
                          <p className="font-semibold text-lg flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            {propertyDetails.annualTax.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {t('Registration Year', 'नोंदणी वर्ष')}
                          </p>
                          <p className="font-semibold">{propertyDetails.registrationYear}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tax Summary */}
                <Card className="shadow-lg border-2 border-orange-200">
                  <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <IndianRupee className="h-5 w-5" />
                      {t('Tax Summary', 'कर सारांश')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">{t('Years', 'वर्षे')}</p>
                        <p className="text-2xl font-bold text-blue-600">{yearsSinceRegistration}</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">{t('Total Paid', 'एकूण भरलेले')}</p>
                        <p className="text-2xl font-bold text-green-600">₹{propertyDetails.totalPaid.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">{t('Total Due', 'एकूण थकबाकी')}</p>
                        <p className="text-2xl font-bold text-red-600">₹{propertyDetails.totalDue.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">{t('Status', 'स्थिती')}</p>
                        <p className={`text-lg font-bold ${propertyDetails.totalDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {propertyDetails.totalDue > 0 
                            ? t('Pending', 'थकबाकी') 
                            : t('Paid', 'भरलेले')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment History */}
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-600" />
                      {t('Payment History', 'भुगतान इतिहास')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {propertyDetails.payments.length > 0 ? (
                      <div className="space-y-3">
                        {propertyDetails.payments.map((payment, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div>
                              <p className="font-semibold">{t('Year', 'वर्ष')} {payment.year}</p>
                              <p className="text-sm text-gray-600">
                                {t('Receipt', 'पावती')}: {payment.receiptNumber}
                              </p>
                              <p className="text-sm text-gray-600">
                                {t('Date', 'तारीख')}: {new Date(payment.date).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">₹{payment.amount.toLocaleString()}</p>
                              <Button variant="outline" size="sm" className="mt-2">
                                <Download className="h-4 w-4 mr-1" />
                                {t('Receipt', 'पावती')}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>{t('No payment history found', 'भुगतान इतिहास सापडला नाही')}</p>
                        <p className="text-sm mt-2">
                          {t('This property has no payment records yet', 'या मालमत्तेचे अद्याप कोणतेही भुगतान नोंद नाहीत')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                {propertyDetails.totalDue > 0 && (
                  <Card className="shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-lg font-semibold mb-4">
                          {t('Total Amount Due', 'एकूण थकबाकी रक्कम')}: 
                          <span className="text-2xl text-red-600 ml-2">₹{propertyDetails.totalDue.toLocaleString()}</span>
                        </p>
                        <Button 
                          size="lg" 
                          className="bg-orange-600 hover:bg-orange-700"
                          onClick={() => setShowPaymentQR(true)}
                        >
                          <IndianRupee className="h-5 w-5 mr-2" />
                          {t('Pay Now', 'आता भरा')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />

      {/* Payment QR Dialog */}
      {propertyDetails && (
        <PropertyPaymentQR
          propertyNumber={propertyDetails.propertyNumber}
          ownerName={language === 'mr' ? propertyDetails.ownerNameMr : propertyDetails.ownerName}
          dueAmount={propertyDetails.totalDue}
          open={showPaymentQR}
          onClose={() => setShowPaymentQR(false)}
        />
      )}
    </div>
  );
}
