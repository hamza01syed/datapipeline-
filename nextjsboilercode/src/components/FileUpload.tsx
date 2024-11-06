"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/v1/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Show success toast
      toast({
        title: "Upload Successful",
        description: "FileUploaded "
        // status: "success", // Ensure this property is supported
      });
      router.push("/")
    } catch (error: any) {
      // Show error toast
      toast({
        title: "Upload Failed",
        description: 'File upload failed: ' + (error.response?.data?.message || error.message),
        // status: "error", // Ensure this property is supported
      });
    }
  };

  return (
    <div className="my-4 space-y-4">
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} className="bg-blue-500 text-white">
        Upload
      </Button>
    </div>
  );
};

export default FileUpload;
