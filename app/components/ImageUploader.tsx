'use client';

import React, { useState } from 'react';

const ImageUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-to-ipfs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setIpfsHash(data.ipfsHash);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4 block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />
      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isUploading ? 'Uploading...' : 'Upload to IPFS'}
      </button>
      {ipfsHash && (
        <div className="mt-4">
          <p className="font-semibold">IPFS Hash:</p>
          <p className="break-all">{ipfsHash}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;