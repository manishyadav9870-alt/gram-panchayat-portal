import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Building2, IndianRupee, Calendar, FileText } from 'lucide-react';
import PropertyUpload from './PropertyUpload';
// import { useToast } from '@/hooks/use-toast';

interface PropertyPayment {
  id: string;
  propertyNumber: string;
  paymentYear: number;
  amountPaid: string;
  paymentDate: string;
  receiptNumber: string;
  paymentMethod: string;
  remarks: string;
  status: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

interface Property {
  id: string;
  propertyNumber: string;
  ownerName: string;
  ownerNameMr: string;
  address: string;
  areaSqft: number;
  annualTax: string;
  registrationYear: number;
  status: string;
}

export default function PropertyTaxAdmin() {
  const [pendingPayments, setPendingPayments] = useState<PropertyPayment[]>([]);
  const [allPayments, setAllPayments] = useState<PropertyPayment[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingRes, allPaymentsRes, propertiesRes] = await Promise.all([
        fetch('/api/admin/pending-payments', { credentials: 'include' }),
        fetch('/api/admin/all-payments', { credentials: 'include' }),
        fetch('/api/admin/properties', { credentials: 'include' }),
      ]);

      console.log('Response statuses:', {
        pending: pendingRes.status,
        allPayments: allPaymentsRes.status,
        properties: propertiesRes.status
      });

      // Check content type
      const pendingText = await pendingRes.clone().text();
      const allPaymentsText = await allPaymentsRes.clone().text();
      const propertiesText = await propertiesRes.clone().text();

      console.log('Raw responses:', {
        pending: pendingText.substring(0, 100),
        allPayments: allPaymentsText.substring(0, 100),
        properties: propertiesText.substring(0, 100)
      });

      if (pendingRes.ok && pendingText.startsWith('[') || pendingText.startsWith('{')) {
        const data = JSON.parse(pendingText);
        console.log('Pending Payments:', data);
        setPendingPayments(data || []);
      } else {
        console.error('Pending payments - invalid response');
      }

      if (allPaymentsRes.ok && (allPaymentsText.startsWith('[') || allPaymentsText.startsWith('{'))) {
        const data = JSON.parse(allPaymentsText);
        console.log('All Payments:', data);
        setAllPayments(data || []);
      } else {
        console.error('All payments - invalid response');
      }

      if (propertiesRes.ok && (propertiesText.startsWith('[') || propertiesText.startsWith('{'))) {
        const data = JSON.parse(propertiesText);
        console.log('Properties:', data);
        setProperties(data || []);
      } else {
        console.error('Properties - invalid response');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentAction = async (paymentId: string, status: 'verified' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        alert(`Payment ${status === 'verified' ? 'approved' : 'rejected'} successfully`);
        fetchData(); // Refresh data
      } else {
        throw new Error('Failed to update payment');
      }
    } catch (error) {
      alert('Failed to update payment status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Property Tax Management</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Building2 className="h-4 w-4 mr-2" />
            {properties.length} Properties
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Clock className="h-4 w-4 mr-2" />
            {pendingPayments.length} Pending
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending Payments ({pendingPayments.length})
          </TabsTrigger>
          <TabsTrigger value="all-payments">
            All Payments ({allPayments.length})
          </TabsTrigger>
          <TabsTrigger value="properties">
            Properties ({properties.length})
          </TabsTrigger>
          <TabsTrigger value="upload">
            Upload Properties
          </TabsTrigger>
        </TabsList>

        {/* Pending Payments Tab */}
        <TabsContent value="pending" className="space-y-4">
          {pendingPayments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No pending payments for verification
              </CardContent>
            </Card>
          ) : (
            pendingPayments.map((payment) => (
              <Card key={payment.id} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {payment.propertyNumber}
                    </CardTitle>
                    {getStatusBadge(payment.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Payment Year</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {payment.paymentYear}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-semibold flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        {Number(payment.amountPaid).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Date</p>
                      <p className="font-semibold">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Method</p>
                      <p className="font-semibold">{payment.paymentMethod}</p>
                    </div>
                  </div>

                  {payment.remarks && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 font-semibold mb-1">Transaction Details:</p>
                      <p className="text-sm font-mono">{payment.remarks}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handlePaymentAction(payment.id, 'verified')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Payment
                    </Button>
                    <Button
                      onClick={() => handlePaymentAction(payment.id, 'rejected')}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* All Payments Tab */}
        <TabsContent value="all-payments" className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Property</th>
                  <th className="border p-3 text-left">Year</th>
                  <th className="border p-3 text-left">Amount</th>
                  <th className="border p-3 text-left">Date</th>
                  <th className="border p-3 text-left">Method</th>
                  <th className="border p-3 text-left">Status</th>
                  <th className="border p-3 text-left">Verified By</th>
                </tr>
              </thead>
              <tbody>
                {allPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="border p-3 font-mono text-sm">{payment.propertyNumber}</td>
                    <td className="border p-3">{payment.paymentYear}</td>
                    <td className="border p-3">₹{Number(payment.amountPaid).toLocaleString()}</td>
                    <td className="border p-3">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                    <td className="border p-3">{payment.paymentMethod}</td>
                    <td className="border p-3">{getStatusBadge(payment.status)}</td>
                    <td className="border p-3 text-sm">{payment.verifiedBy || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Card key={property.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-orange-600" />
                    {property.propertyNumber}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Owner</p>
                    <p className="font-semibold">{property.ownerName}</p>
                    <p className="text-sm text-gray-600">{property.ownerNameMr}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-sm">{property.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div>
                      <p className="text-xs text-gray-500">Area</p>
                      <p className="font-semibold">{property.areaSqft} sq.ft</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Annual Tax</p>
                      <p className="font-semibold">₹{Number(property.annualTax).toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Registered</p>
                    <p className="text-sm">{property.registrationYear}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Upload Properties Tab */}
        <TabsContent value="upload">
          <PropertyUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
}
