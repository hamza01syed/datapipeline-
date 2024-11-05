"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
  const [error, setError] = useState<string>('');

  const fetchMediaFiles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/v1/media');
      setMediaFiles(response.data.data);
    } catch (error) {
      setError('Failed to fetch media files');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/v1/media/${id}`);
      setMediaFiles((prev) => prev.filter((file) => file._id !== id));
    } catch (error) {
      setError('Failed to delete media file');
    }
  };

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  console.log(mediaFiles)
  return (
    <div>
      <h2 className="text-2xl font-bold">Uploaded Files</h2>
      <ul>
        {mediaFiles.map((file) => (
          <li key={file._id} className="flex justify-between items-center my-2">
            <div>
              <p>{file.filename} ({file.fileSize} bytes)</p>
              <a href={file.s3Url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                View
              </a>
            </div>
            <button
              onClick={() => handleDelete(file._id)}
              className="ml-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
