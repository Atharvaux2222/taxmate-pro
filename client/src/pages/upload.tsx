import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import FileUpload from "@/components/FileUpload";
import { CloudUpload, Shield, Trash2, FileText, AlertCircle } from "lucide-react";

export default function Upload() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('form16', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch('/api/upload-form16', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      
      toast({
        title: "Upload Successful! 🎉",
        description: "Your Form 16 has been processed. Check your dashboard for results.",
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (error) {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }

      toast({
        title: "Upload Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            Upload Your Form 16 📂
          </h1>
          <p className="text-xl text-neutral-600">
            Drag and drop or click to upload. We support PDF and image formats.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            {!isUploading && !uploadedFile ? (
              <FileUpload onFileSelect={handleFileUpload} />
            ) : (
              <div className="space-y-6">
                {/* Upload Progress */}
                {uploadedFile && (
                  <div className="bg-white p-6 rounded-xl border border-neutral-200">
                    <div className="flex items-center space-x-4 mb-4">
                      <FileText className="h-8 w-8 text-red-500" />
                      <div className="flex-1">
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-neutral-600">
                          {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <span className="text-primary font-medium">
                        {isUploading ? "Analyzing..." : "Complete"}
                      </span>
                    </div>
                    
                    <Progress value={uploadProgress} className="mb-2" />
                    
                    <p className="text-sm text-neutral-600">
                      🤖 Our AI is extracting data from your Form 16...
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-neutral-800">
                <AlertCircle className="mr-2 h-5 w-5 text-primary" />
                Where to find Form 16?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-neutral-600 space-y-2">
                <li>• Check your email from HR department</li>
                <li>• Download from employee portal</li>
                <li>• Request from your company's accounts team</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center text-neutral-800">
                <CloudUpload className="mr-2 h-5 w-5 text-secondary" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-neutral-600 space-y-2">
                <li>• Ensure document is clear and readable</li>
                <li>• Form 16 should be for FY 2023-24</li>
                <li>• Multiple pages? Upload as single PDF</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <div className="mt-8">
          <Card className="bg-neutral-100 border border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-6 text-sm text-neutral-600">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-secondary" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trash2 className="h-4 w-4 text-accent" />
                  <span>Auto-deleted after processing</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
