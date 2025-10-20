import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Download, CheckCircle, Copy } from 'lucide-react';
import QRCode from 'qrcode';
import { useToast } from '@/hooks/use-toast';

interface WaterPaymentQRProps {
  propertyNumber: string;
  ownerName: string;
  dueAmount: number;
  open: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

export default function WaterPaymentQR({
  propertyNumber,
  ownerName,
  dueAmount,
  open,
  onClose,
  onPaymentSuccess,
}: WaterPaymentQRProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(dueAmount);
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // UPI Configuration
  const UPI_ID = 'grampanchayat@paytm';
  const PAYEE_NAME = 'Kishore Gram Panchayat';

  useEffect(() => {
    if (open && paymentAmount > 0) {
      generateQRCode();
    }
  }, [open, paymentAmount]);

  const generateQRCode = async () => {
    try {
      const upiString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${paymentAmount}&cu=INR&tn=${encodeURIComponent(`Water Bill ${propertyNumber}`)}`;
      
      const qrDataUrl = await QRCode.toDataURL(upiString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const copyUPIId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = `water-payment-qr-${propertyNumber}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const handlePaymentConfirmation = async () => {
    if (!transactionId.trim()) {
      toast({
        title: "Error",
        description: "कृपया Transaction ID दर्ज करें / Please enter transaction ID",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Submit payment confirmation to backend with allocation flag
      const response = await fetch('/api/admin/water/payments/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyNumber,
          amount: paymentAmount,
          paymentDate: new Date().toISOString().split('T')[0],
          receiptNumber: `WB/${new Date().getFullYear()}/${Date.now()}`,
          paymentMethod: 'UPI',
          remarks: `UPI Transaction ID: ${transactionId}`,
          allocateToOldest: true, // Auto-allocate to oldest pending bills
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success!",
          description: `भुगतान सफल! ${result.billsPaid} महीने clear हो गए / Payment successful! ${result.billsPaid} months cleared`
        });
        onClose();
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "भुगतान दर्ज करने में विफल / Failed to record payment",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: "Error",
        description: "भुगतान दर्ज करने में विफल / Failed to record payment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-blue-600" />
            Pay Water Bill via UPI / UPI से जल बिल भुगतान
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Property Number / घर पट्टी नंबर</p>
            <p className="font-semibold">{propertyNumber}</p>
            <p className="text-sm text-gray-600 mt-2">Consumer Name / उपभोक्ता का नाम</p>
            <p className="font-semibold">{ownerName}</p>
          </div>

          {/* Amount Display - Full Due Only */}
          <div>
            <Label>Payment Amount / भुगतान राशि</Label>
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Due Amount / कुल बकाया राशि</p>
              <p className="text-3xl font-bold text-red-600">₹{dueAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">
                QR payment pays full due amount only<br />
                QR भुगतान केवल पूर्ण बकाया राशि का भुगतान करता है
              </p>
            </div>
          </div>

          {/* QR Code */}
          {qrCodeUrl && (
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                <img src={qrCodeUrl} alt="Payment QR Code" className="w-64 h-64" />
              </div>
              <p className="text-sm text-center text-gray-600">
                Scan with any UPI app to pay<br />
                किसी भी UPI ऐप से स्कैन करें
              </p>
              <Button onClick={downloadQR} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download QR / QR डाउनलोड करें
              </Button>
            </div>
          )}

          {/* UPI ID */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">UPI ID</p>
            <div className="flex items-center justify-between">
              <p className="font-mono font-semibold">{UPI_ID}</p>
              <Button onClick={copyUPIId} variant="ghost" size="sm">
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Transaction ID Input */}
          <div>
            <Label htmlFor="transactionId">
              Transaction ID (After Payment) / व्यवहार आयडी (भुगतान के बाद)
            </Label>
            <Input
              id="transactionId"
              placeholder="Enter UPI transaction ID / UPI ट्रांजेक्शन ID दर्ज करें"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter transaction ID to confirm payment / भुगतान पुष्टि के लिए ट्रांजेक्शन ID दर्ज करें
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel / रद्द करें
            </Button>
            <Button 
              onClick={handlePaymentConfirmation} 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!transactionId.trim() || loading}
            >
              {loading ? 'Processing...' : 'Confirm Payment / भुगतान पुष्टि करें'}
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 p-3 rounded-lg text-sm">
            <p className="font-semibold mb-2">Instructions / निर्देश:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Scan QR code with any UPI app / किसी भी UPI ऐप से QR कोड स्कैन करें</li>
              <li>Complete the payment / भुगतान पूर्ण करें</li>
              <li>Enter transaction ID above / ऊपर ट्रांजेक्शन ID दर्ज करें</li>
              <li>Click Confirm Payment / भुगतान पुष्टि करें पर क्लिक करें</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
