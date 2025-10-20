import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Download, CheckCircle, Copy } from 'lucide-react';
import QRCode from 'qrcode';

interface PropertyPaymentQRProps {
  propertyNumber: string;
  ownerName: string;
  dueAmount: number;
  open: boolean;
  onClose: () => void;
}

export default function PropertyPaymentQR({
  propertyNumber,
  ownerName,
  dueAmount,
  open,
  onClose,
}: PropertyPaymentQRProps) {
  const { t } = useLanguage();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(dueAmount);
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // UPI Configuration - Replace with your actual UPI ID
  const UPI_ID = 'grampanchayat@paytm'; // TODO: Replace with actual UPI ID
  const PAYEE_NAME = 'Kishore Gram Panchayat';

  useEffect(() => {
    if (open && paymentAmount > 0) {
      generateQRCode();
    }
  }, [open, paymentAmount]);

  const generateQRCode = async () => {
    try {
      // Generate UPI payment string
      const upiString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${paymentAmount}&cu=INR&tn=${encodeURIComponent(`Property Tax ${propertyNumber}`)}`;
      
      // Generate QR Code
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
    link.download = `payment-qr-${propertyNumber}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const handlePaymentConfirmation = async () => {
    if (!transactionId.trim()) {
      alert(t('Please enter transaction ID', 'कृपया व्यवहार आयडी प्रविष्ट करा'));
      return;
    }

    try {
      // Submit payment confirmation to backend
      const response = await fetch('/api/property-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyNumber,
          paymentYear: new Date().getFullYear(),
          amountPaid: paymentAmount,
          paymentDate: new Date().toISOString().split('T')[0],
          receiptNumber: `RCP/${new Date().getFullYear()}/${Date.now()}`,
          paymentMethod: 'UPI',
          remarks: `Transaction ID: ${transactionId}`,
        }),
      });

      const result = await response.json();
      console.log('Payment API Response:', response.status, result);
      
      if (response.ok) {
        alert(t('Payment submitted for verification!', 'भुगतान पडताळणीसाठी सबमिट केले!'));
        onClose();
        window.location.reload(); // Refresh to show updated data
      } else {
        console.error('Payment failed:', result);
        alert(result.message || t('Failed to record payment', 'भुगतान नोंदवण्यात अयशस्वी'));
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      alert(t('Failed to record payment', 'भुगतान नोंदवण्यात अयशस्वी'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-orange-600" />
            {t('Pay via UPI', 'UPI द्वारे भरा')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{t('Property', 'मालमत्ता')}</p>
            <p className="font-semibold">{propertyNumber}</p>
            <p className="text-sm text-gray-600 mt-2">{t('Owner', 'मालक')}</p>
            <p className="font-semibold">{ownerName}</p>
          </div>

          {/* Amount Input */}
          <div>
            <Label htmlFor="amount">{t('Payment Amount', 'भुगतान रक्कम')}</Label>
            <Input
              id="amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              className="text-lg font-bold"
            />
            <p className="text-sm text-gray-500 mt-1">
              {t('Due Amount', 'थकबाकी रक्कम')}: ₹{dueAmount.toLocaleString()}
            </p>
          </div>

          {/* QR Code */}
          {qrCodeUrl && (
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <img src={qrCodeUrl} alt="Payment QR Code" className="w-64 h-64" />
              </div>
              <p className="text-sm text-center text-gray-600">
                {t('Scan with any UPI app to pay', 'कोणत्याही UPI अॅपने स्कॅन करा')}
              </p>
              <Button onClick={downloadQR} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t('Download QR', 'QR डाउनलोड करा')}
              </Button>
            </div>
          )}

          {/* UPI ID */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">{t('UPI ID', 'UPI आयडी')}</p>
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
              {t('Transaction ID (After Payment)', 'व्यवहार आयडी (भुगतानानंतर)')}
            </Label>
            <Input
              id="transactionId"
              placeholder={t('Enter UPI transaction ID', 'UPI व्यवहार आयडी प्रविष्ट करा')}
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('Enter transaction ID to confirm payment', 'भुगतान पुष्टी करण्यासाठी व्यवहार आयडी प्रविष्ट करा')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              {t('Cancel', 'रद्द करा')}
            </Button>
            <Button 
              onClick={handlePaymentConfirmation} 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!transactionId.trim()}
            >
              {t('Confirm Payment', 'भुगतान पुष्टी करा')}
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 p-3 rounded-lg text-sm">
            <p className="font-semibold mb-2">{t('Instructions', 'सूचना')}:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>{t('Scan QR code with any UPI app', 'कोणत्याही UPI अॅपने QR कोड स्कॅन करा')}</li>
              <li>{t('Complete the payment', 'भुगतान पूर्ण करा')}</li>
              <li>{t('Enter transaction ID above', 'वरील व्यवहार आयडी प्रविष्ट करा')}</li>
              <li>{t('Click Confirm Payment', 'भुगतान पुष्टी करा क्लिक करा')}</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
