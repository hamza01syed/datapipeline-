"use client";
import React, { useState, useRef } from 'react';
import axios from 'axios';

const SearchMedia: React.FC<{ onSearch: (results: any[]) => void }> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null); // Correct usage of useRef

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/v1/media/search/${query}`);
      console.log(response.data);
      onSearch(response.data); // Assuming response.data holds the results
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="my-4">
      <input
        ref={inputRef} // Correct usage of ref
        type="text"
        placeholder="Search media files..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded px-4 py-2"
      />
      <button onClick={handleSearch} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
        Search
      </button>
    </div>
  );
};

export default SearchMedia;
