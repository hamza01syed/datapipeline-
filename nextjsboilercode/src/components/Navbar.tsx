"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false); // Close the menu after navigation
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="font-bold text-xl cursor-pointer" onClick={() => handleNavigation('/')}>
          Data
        </div>
        <div className="hidden md:flex space-x-4">
          <Button variant="link" onClick={() => handleNavigation('/')}>Home</Button>
          <Button variant="link" onClick={() => handleNavigation('/upload')}>Upload</Button>
          <Button variant="link" onClick={() => handleNavigation('/services')}>Services</Button>
          <Button variant="link" onClick={() => handleNavigation('/contact')}>Contact</Button>
        </div>
        <button
          className="md:hidden focus:outline-none"
          onClick={handleToggle}
        >
          {isOpen ? '✖' : '☰'}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="flex flex-col p-4 space-y-2">
            <Button variant="link" onClick={() => handleNavigation('/home')}>Home</Button>
            <Button variant="link" onClick={() => handleNavigation('/about')}>About</Button>
            <Button variant="link" onClick={() => handleNavigation('/services')}>Services</Button>
            <Button variant="link" onClick={() => handleNavigation('/contact')}>Contact</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
