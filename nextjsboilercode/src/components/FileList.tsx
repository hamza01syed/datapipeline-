"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";  // Adjust the import path as needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";  // Adjust the import path
import { Alert, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

interface MediaFile {
  _id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  s3Url: string;
}

const FileList: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchMediaFiles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/v1/media");
      setMediaFiles(response.data.data);
    } catch (error) {
      setError("Failed to fetch media files");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/v1/media/${id}`);
      setMediaFiles((prev) => prev.filter((file) => file._id !== id));
    } catch (error) {
      setError("Failed to delete media file");
    }
  };

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <Alert variant="destructive">
        <AlertTitle>{error}</AlertTitle>
      </Alert>
    );

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Uploaded Files</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mediaFiles.map((file) => (
            <li key={file._id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <p className="font-semibold">{file.filename}</p>
                <p className="text-sm text-gray-600">Size: {file.fileSize} bytes</p>
                <Link
                  href={file.s3Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </div>
              <Button
                variant="destructive"
                onClick={() => handleDelete(file._id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default FileList;
