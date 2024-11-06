"use client";
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";  // Adjust the import path as needed
import { Input } from "@/components/ui/input";    // Adjust the import path as needed

const SearchMedia: React.FC<{ onSearch: (results: any[]) => void }> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/v1/media/search/${query}`);
      onSearch(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className="my-4 flex items-center space-x-4">
      <Input
        type="text"
        placeholder="Search media files..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
      />
      <Button onClick={handleSearch} variant="default">
        Search
      </Button>
    </div>
  );
};

export default SearchMedia;
