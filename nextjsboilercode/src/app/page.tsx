"use client"
import Head from 'next/head';
import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import SearchMedia from '../components/SearchMedia';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Home: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Head>
        <title>Media Upload App</title>
      </Head>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Media Upload Application</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload />
        </CardContent>
      </Card>

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
                  <p>{file.filename} ({file.fileSize} bytes)</p>
                  <Button  ref={file.s3Url}  rel="noopener noreferrer" className="text-blue-600">
                    View
                  </Button>
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
