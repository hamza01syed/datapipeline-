"use client"
import React, { useState } from 'react';
import Head from 'next/head';
import FileUpload from './FileUpload';
import FileList from './FileList';
import SearchMedia from './SearchMedia';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const Home: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  return (
    <div className="container mx-auto p-4 space-y-8">
     
      

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Search Media Files</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchMedia onSearch={setSearchResults} />
        </CardContent>
      </Card>

      {searchResults.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {searchResults.map((file) => (
                <li key={file._id} className="my-2">
                  <p className='font-bold'>{file.filename} ({file.fileSize} bytes)</p>
                  <Link
                    href={file.s3Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <FileList />
      )}
    </div>
  );
};

export default Home;
