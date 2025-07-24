import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { CloudUpload, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        {...getRootProps()} 
        className={`border-2 border-dashed cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-neutral-300 hover:border-primary'
        }`}
      >
        <CardContent className="p-12 text-center">
          <input {...getInputProps()} />
          
          <div className="mb-6">
            <CloudUpload className="h-16 w-16 text-neutral-400 mx-auto" />
          </div>
          
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">
            {isDragActive ? (
              "Drop your Form 16 here!"
            ) : (
              <>Drop your Form 16 here, or <span className="text-primary">browse</span></>
            )}
          </h3>
          
          <p className="text-neutral-600 mb-6">
            Supports PDF, JPG, PNG files up to 10MB
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-500">
            <span className="flex items-center space-x-1">
              <i className="fas fa-shield-alt text-secondary"></i>
              <span>Secure & Private</span>
            </span>
            <span className="flex items-center space-x-1">
              <i className="fas fa-trash-alt text-accent"></i>
              <span>Auto-deleted after processing</span>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* File Rejection Errors */}
      {fileRejections.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Upload Error</span>
            </div>
            <ul className="mt-2 text-sm text-red-600">
              {fileRejections.map(({ file, errors }) => (
                <li key={file.name}>
                  {file.name}:
                  <ul className="list-disc list-inside ml-4">
                    {errors.map((error) => (
                      <li key={error.code}>
                        {error.code === 'file-too-large' 
                          ? 'File is too large. Maximum size is 10MB.' 
                          : error.code === 'file-invalid-type'
                          ? 'Invalid file type. Only PDF, JPG, and PNG files are allowed.'
                          : error.message
                        }
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
