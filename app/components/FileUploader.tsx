'use client';

import React, { useState, useRef } from 'react';

const ImageUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const inputFile = useRef<HTMLInputElement>(null);

  const uploadFile = async (fileToUpload: File) => {
    try {
      setUploading(true);
      const data = new FormData();
      data.set("file", fileToUpload);
      const res = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      if (!res.ok) {
        throw new Error('Upload failed');
      }
      const resData = await res.json();
      setCid(resData.IpfsHash);
    } catch (e) {
      console.error('Error uploading file:', e);
      alert("Trouble uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      uploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <input 
        type="file" 
        id="file" 
        ref={inputFile} 
        onChange={handleChange} 
        className="hidden"
      />
      <button 
        onClick={() => inputFile.current?.click()}
        disabled={uploading}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload to IPFS"}
      </button>
      {cid && (
        <div className="mt-4">
          <p className="font-semibold">IPFS Hash:</p>
          <p className="break-all">{cid}</p>
          <a 
            href={`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            View on IPFS
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;