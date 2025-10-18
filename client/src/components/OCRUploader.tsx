import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OCRResult {
  success: boolean;
  totalPages: number;
  extractedText: string;
  parsedData?: Record<string, string>;
  error?: string;
}

export default function OCRUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OCRResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid File",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a PDF file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleExtractText = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("/api/ocr/extract", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        toast({
          title: "Success",
          description: `Extracted text from ${data.totalPages} page(s)`,
        });
      } else {
        toast({
          title: "Extraction Failed",
          description: data.error || "Failed to extract text from PDF",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleParseBirthCertificate = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("/api/ocr/birth-certificate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        toast({
          title: "Success",
          description: "Birth certificate parsed successfully",
        });
      } else {
        toast({
          title: "Parsing Failed",
          description: data.error || "Failed to parse birth certificate",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process birth certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Marathi PDF OCR Processor
          </CardTitle>
          <CardDescription>
            Upload a Marathi PDF document to extract text using Tesseract OCR
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pdf-upload">Upload PDF Document</Label>
            <div className="flex gap-2">
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={loading}
              />
              {file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {file.name}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleExtractText}
              disabled={!file || loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Extract Text
                </>
              )}
            </Button>

            <Button
              onClick={handleParseBirthCertificate}
              disabled={!file || loading}
              variant="secondary"
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Parse Birth Certificate
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <>
          {result.parsedData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Parsed Data
                </CardTitle>
                <CardDescription>
                  Extracted fields from birth certificate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(result.parsedData).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-sm font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </Label>
                      <div className="p-2 bg-muted rounded-md text-sm">
                        {value || "Not found"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Extracted Text
              </CardTitle>
              <CardDescription>
                {result.success
                  ? `Successfully extracted text from ${result.totalPages} page(s)`
                  : "Failed to extract text"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={result.extractedText}
                readOnly
                className="min-h-[300px] font-mono text-sm"
                placeholder="Extracted text will appear here..."
              />
            </CardContent>
          </Card>

          {result.success && result.totalPages > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Page-by-Page Results</CardTitle>
                <CardDescription>
                  Text extracted from each page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* @ts-ignore - pages property exists in OCRResult */}
                {result.pages?.map((page: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-sm font-medium">
                      Page {page.pageNumber}
                    </Label>
                    <Textarea
                      value={page.text}
                      readOnly
                      className="min-h-[150px] font-mono text-sm"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
