import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, FileText, Droplets, ArrowLeft } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

export default function WaterBillUpload() {
  const [, setLocation] = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading file:', file.name);
      const response = await fetch('/api/admin/water/bills/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);
      
      if (response.ok) {
        setResult(result);
        setFile(null);
        const fileInput = document.getElementById('water-bill-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        toast({
          title: "Success!",
          description: `${result.success} water bills created successfully`
        });
      } else {
        console.error('Upload failed:', result);
        setResult(result);
        toast({
          title: "Error",
          description: result.message || 'Upload failed',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = (format: 'csv' | 'excel') => {
    const headers = [
      'property_number',
      'payment_month',
      'amount',
      'status'
    ];
    
    const sampleData = [
      ['GP/2025/001', '2025-01', '200', 'pending'],
      ['GP/2025/001', '2025-02', '200', 'pending'],
      ['GP/2025/001', '2025-03', '200', 'pending'],
      ['GP/2025/002', '2025-01', '200', 'pending'],
      ['GP/2025/002', '2025-02', '200', 'pending'],
    ];

    if (format === 'excel') {
      const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'WaterBills');
      XLSX.writeFile(wb, 'water_bills_template.xlsx');
    } else {
      const BOM = '\uFEFF';
      const csv = BOM + [headers.join(','), ...sampleData.map(row => row.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'water_bills_template.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Button 
          onClick={() => setLocation('/admin')}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-600" />
            Bulk Water Bill Upload / जल बिल बल्क अपलोड
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Download Template */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Step 1: Download Template / टेम्पलेट डाउनलोड करें
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Download the template and fill in water bill data for multiple months<br />
              टेम्पलेट डाउनलोड करें और कई महीनों के लिए जल बिल डेटा भरें
            </p>
            <div className="flex gap-2">
              <Button onClick={() => downloadTemplate('excel')} variant="outline" size="sm" className="flex-1">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Download Excel Template
              </Button>
              <Button onClick={() => downloadTemplate('csv')} variant="outline" size="sm" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Download CSV Template
              </Button>
            </div>
          </div>

          {/* Upload File */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Step 2: Upload Filled File / भरी हुई फ़ाइल अपलोड करें
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Select your filled CSV or Excel file and upload<br />
              अपनी भरी हुई CSV या Excel फ़ाइल चुनें और अपलोड करें
            </p>
            
            <div className="space-y-3">
              <input
                id="water-bill-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              
              {file && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>{file.name}</span>
                </div>
              )}

              <Button 
                onClick={handleUpload} 
                disabled={!file || uploading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {uploading ? 'Uploading... / अपलोड हो रहा है...' : 'Upload Water Bills / जल बिल अपलोड करें'}
              </Button>
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg">
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-lg font-semibold text-blue-700">Creating water bills...</span>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className={`border-2 p-6 rounded-lg ${result.failed > 0 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                {result.failed > 0 ? (
                  <>
                    <XCircle className="h-6 w-6 text-orange-600" />
                    <span className="text-orange-700">Upload Completed with Errors</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span className="text-green-700">Upload Successful!</span>
                  </>
                )}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-white p-3 rounded border">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-lg font-semibold text-green-700">
                    {result.success} water bills created successfully
                  </span>
                </div>
                
                {result.failed > 0 && (
                  <div className="flex items-center gap-3 bg-white p-3 rounded border">
                    <XCircle className="h-6 w-6 text-red-600" />
                    <span className="text-lg font-semibold text-red-700">
                      {result.failed} bills failed
                    </span>
                  </div>
                )}

                {result.errors.length > 0 && (
                  <div className="mt-4 bg-white p-4 rounded border border-red-200">
                    <p className="text-base font-bold text-red-700 mb-3">Error Details:</p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-red-600">
                      {result.errors.slice(0, 10).map((error, index) => (
                        <li key={index} className="ml-2">{error}</li>
                      ))}
                      {result.errors.length > 10 && (
                        <li className="ml-2 font-semibold">...and {result.errors.length - 10} more errors</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-yellow-50 p-4 rounded-lg text-sm">
            <p className="font-semibold mb-2">File Format Instructions / फ़ाइल प्रारूप निर्देश:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Both CSV and Excel (.xlsx) formats are supported / CSV और Excel दोनों समर्थित हैं</li>
              <li>Property number must exist in properties table / संपत्ति संख्या properties table में होनी चाहिए</li>
              <li>Payment month format: YYYY-MM (e.g., 2025-01 for January 2025)</li>
              <li>Amount should be in rupees (e.g., 200)</li>
              <li>Status: 'pending' for unpaid bills, 'paid' for paid bills</li>
              <li>You can add multiple months for same property in one file</li>
            </ul>
          </div>

          {/* Example */}
          <div className="bg-purple-50 p-4 rounded-lg text-sm">
            <p className="font-semibold mb-2">Example / उदाहरण:</p>
            <div className="bg-white p-3 rounded border font-mono text-xs overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">property_number</th>
                    <th className="text-left p-2">payment_month</th>
                    <th className="text-left p-2">amount</th>
                    <th className="text-left p-2">status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2">GP/2025/001</td><td className="p-2">2025-01</td><td className="p-2">200</td><td className="p-2">pending</td></tr>
                  <tr><td className="p-2">GP/2025/001</td><td className="p-2">2025-02</td><td className="p-2">200</td><td className="p-2">pending</td></tr>
                  <tr><td className="p-2">GP/2025/001</td><td className="p-2">2025-03</td><td className="p-2">200</td><td className="p-2">pending</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              This will create 3 pending bills (Jan-Mar 2025) for property GP/2025/001
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
