import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Droplets, Calendar, IndianRupee, CheckCircle, XCircle, Clock, CreditCard, QrCode, Download, Home } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import WaterPaymentQR from '@/components/WaterPaymentQR';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Property {
  propertyNumber: string;
  ownerName: string;
  ownerNameMr: string | null;
  address: string;
  addressMr: string | null;
  areaSqft: number;
  annualTax: string;
  status: string;
}

interface WaterPayment {
  id: string;
  paymentMonth: string;
  amount: string;
  paymentDate: string | null;
  receiptNumber: string | null;
  status: string;
}

export default function WaterBillCheck() {
  const [propertyNumber, setPropertyNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [payments, setPayments] = useState<WaterPayment[]>([]);
  const [error, setError] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [paymentMonth, setPaymentMonth] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('200');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!propertyNumber.trim()) {
      setError('कृपया घर पट्टी नंबर दर्ज करें / Please enter property number');
      return;
    }

    setLoading(true);
    setError('');
    setProperty(null);
    setPayments([]);

    try {
      // Fetch property and water payment details
      const response = await fetch(`/api/water/property/${encodeURIComponent(propertyNumber)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('घर पट्टी नहीं मिली / Property not found');
        } else {
          setError('कुछ गलत हो गया / Something went wrong');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setProperty(data.property);
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Search error:', error);
      setError('कुछ गलत हो गया / Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'paid') {
      return (
        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-sm">
          <CheckCircle className="h-4 w-4" />
          Paid
        </span>
      );
    } else if (status === 'pending') {
      return (
        <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded text-sm">
          <Clock className="h-4 w-4" />
          Pending
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-sm">
          <XCircle className="h-4 w-4" />
          Overdue
        </span>
      );
    }
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  // Calculate bill amounts
  const paidPayments = payments.filter(p => p.status === 'paid');
  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'overdue');
  
  const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const paidAmount = paidPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const dueAmount = pendingPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);


  const handlePayment = async () => {
    if (!paymentMonth || !paymentAmount) {
      toast({
        title: "Error",
        description: "कृपया सभी फील्ड भरें / Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    setPaymentLoading(true);
    try {
      const response = await fetch('/api/admin/water/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyNumber: property?.propertyNumber,
          paymentMonth,
          amount: parseFloat(paymentAmount),
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod,
          remarks: 'Online payment by consumer'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment failed');
      }

      toast({
        title: "Success!",
        description: "भुगतान सफल रहा / Payment successful"
      });

      // Refresh payment history
      handleSearch();
      setPaymentDialogOpen(false);
      setPaymentMonth('');
      setPaymentAmount('200');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "भुगतान विफल / Payment failed",
        variant: "destructive"
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
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
                <Droplets className="h-12 w-12" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Water Bill Check / जल बिल जांच
              </h1>
              <p className="text-lg text-blue-100">
                View water bill details and payment history / जल बिल विवरण और भुगतान इतिहास देखें
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">

        {/* Search Card */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search by Property Number / घर पट्टी नंबर से खोजें
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Enter Property Number (e.g., घर पट्टी-123)"
                value={propertyNumber}
                onChange={(e) => setPropertyNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 text-lg"
              />
              <Button 
                onClick={handleSearch} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
            {error && (
              <p className="text-red-600 mt-3 text-center">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Property Details - Water Bill Info Only */}
        {property && (
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
              <CardTitle>Consumer Details / उपभोक्ता विवरण</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Property Number / घर पट्टी नंबर</p>
                  <p className="text-lg font-semibold">{property.propertyNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Consumer Name / उपभोक्ता का नाम</p>
                  <p className="text-lg font-semibold">{property.ownerName}</p>
                  {property.ownerNameMr && (
                    <p className="text-sm text-gray-500">{property.ownerNameMr}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Address / पता</p>
                  <p className="text-lg font-semibold">{property.address}</p>
                  {property.addressMr && (
                    <p className="text-sm text-gray-500">{property.addressMr}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Water Charge / मासिक जल शुल्क</p>
                  <p className="text-2xl font-bold text-blue-600 flex items-center gap-1">
                    <IndianRupee className="h-5 w-5" />
                    200.00
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Months / बकाया महीने</p>
                  <p className="text-lg font-semibold text-orange-600">{pendingPayments.length} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Amount / बकाया राशि</p>
                  <p className="text-2xl font-bold text-red-600 flex items-center gap-1">
                    <IndianRupee className="h-5 w-5" />
                    {dueAmount.toFixed(2)}
                  </p>
                </div>
              </div>
              
              {/* Pay Now Button - Opens QR Dialog */}
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={() => setQrDialogOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
                  disabled={dueAmount === 0}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pay Water Bill / बिल भुगतान करें
                </Button>
              </div>
              <div className="mt-4 flex justify-center">
                <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-sm">
                      Record Manual Payment / मैनुअल भुगतान दर्ज करें
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Pay Water Bill / जल बिल भुगतान</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {/* Pending Months Selection */}
                      {pendingPayments.length > 0 && (
                        <div>
                          <Label className="text-sm font-semibold mb-2 block">Select Months to Pay / भुगतान के लिए महीने चुनें</Label>
                          <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                            {pendingPayments.map((payment) => (
                              <label key={payment.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={paymentMonth === payment.paymentMonth}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setPaymentMonth(payment.paymentMonth);
                                      setPaymentAmount(payment.amount);
                                    } else {
                                      setPaymentMonth('');
                                      setPaymentAmount('200');
                                    }
                                  }}
                                  className="w-4 h-4"
                                />
                                <div className="flex-1">
                                  <p className="font-semibold">{formatMonth(payment.paymentMonth)}</p>
                                  <p className="text-sm text-gray-600">₹{parseFloat(payment.amount).toFixed(2)}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Select one month at a time / एक बार में एक महीना चुनें
                          </p>
                        </div>
                      )}

                      <div>
                        <Label className="text-sm font-semibold mb-2 block">Payment Method / भुगतान विधि</Label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="cash">Cash / नकद</option>
                          <option value="online">Online / ऑनलाइन</option>
                          <option value="upi">UPI</option>
                          <option value="card">Card / कार्ड</option>
                        </select>
                      </div>
                      <Button
                        onClick={handlePayment}
                        disabled={paymentLoading || !paymentMonth}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
                      >
                        {paymentLoading ? 'Processing... / प्रोसेसिंग...' : `Pay ₹${paymentAmount} / ₹${paymentAmount} भुगतान करें`}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="hidden">
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bill Summary - Total/Paid/Due */}
        {property && payments.length > 0 && (
          <Card className="shadow-lg border-2 border-blue-300">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Bill Summary / बिल सारांश
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-6">
                {/* Months */}
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Months / महीने</p>
                  <p className="text-2xl font-bold text-blue-600">{payments.length}</p>
                </div>

                {/* Total Amount */}
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Amount / कुल राशि</p>
                  <p className="text-2xl font-bold text-purple-600">₹{totalAmount.toFixed(2)}</p>
                </div>

                {/* Paid Amount */}
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Paid / भुगतान</p>
                  <p className="text-2xl font-bold text-green-600">₹{paidAmount.toFixed(2)}</p>
                </div>

                {/* Due Amount */}
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Due / बकाया</p>
                  <p className="text-2xl font-bold text-red-600">₹{dueAmount.toFixed(2)}</p>
                </div>
              </div>

              {/* Payment Actions */}
              <div className="mt-6 flex justify-center gap-4">
                {dueAmount > 0 && (
                  <Button 
                    onClick={() => setQrDialogOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-base"
                  >
                    <QrCode className="mr-2 h-5 w-5" />
                    Pay via QR Code / QR से भुगतान करें
                  </Button>
                )}
                {paidAmount > 0 && (
                  <Button 
                    onClick={() => {
                      // Generate receipt PDF/download
                      window.print();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Receipt / रसीद डाउनलोड करें
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Water Payment QR Component */}
        {property && (
          <WaterPaymentQR
            propertyNumber={property.propertyNumber}
            ownerName={property.ownerName}
            dueAmount={dueAmount}
            open={qrDialogOpen}
            onClose={() => setQrDialogOpen(false)}
            onPaymentSuccess={handleSearch}
          />
        )}

        {/* Payment History */}
        {property && payments.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CardTitle>Payment History / भुगतान इतिहास</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[...payments].sort((a, b) => a.paymentMonth.localeCompare(b.paymentMonth)).map((payment) => (
                  <div 
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-semibold">{formatMonth(payment.paymentMonth)}</p>
                        {payment.paymentDate && (
                          <p className="text-sm text-gray-600">
                            Paid on: {new Date(payment.paymentDate).toLocaleDateString('en-IN')}
                          </p>
                        )}
                        {payment.receiptNumber && (
                          <p className="text-xs text-gray-500">Receipt: {payment.receiptNumber}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-bold flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        {payment.amount}
                      </p>
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {!loading && !property && !error && (
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center text-gray-500">
              <Droplets className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Enter your property number to check water bill</p>
              <p className="text-sm">अपना घर पट्टी नंबर दर्ज करें</p>
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
