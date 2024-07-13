'use client';

import React, { useState, useRef } from 'react';

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [imageCid, setImageCid] = useState<string | null>(null);
  const [metadataCid, setMetadataCid] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const inputFile = useRef<HTMLInputElement>(null);

  const uploadFile = async (fileToUpload: File) => {
    try {
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
      return resData.IpfsHash;
    } catch (e) {
      console.error('Error uploading file:', e);
      throw e;
    }
  };

  const uploadMetadata = async (imageUrl: string, bio: string) => {
    try {
      const metadata = JSON.stringify({ image: imageUrl, bio });
      const blob = new Blob([metadata], { type: 'application/json' });
      const metadataFile = new File([blob], 'metadata.json');
      return await uploadFile(metadataFile);
    } catch (e) {
      console.error('Error uploading metadata:', e);
      throw e;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !bio) {
      alert("Please provide both an image and a bio.");
      return;
    }

    setUploading(true);
    try {
      // Upload image
      const imageCid = await uploadFile(file);
      setImageCid(imageCid);

      // Create and upload metadata
      const imageUrl = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${imageCid}`;
      const metadataCid = await uploadMetadata(imageUrl, bio);
      setMetadataCid(metadataCid);

    } catch (error) {
      alert("Error uploading files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bio" className="block mb-2">Bio:</label>
          <textarea 
            id="bio" 
            value={bio} 
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="file" className="block mb-2">Image:</label>
          <input 
            type="file" 
            id="file" 
            ref={inputFile}
            onChange={handleFileChange}
            accept="image/*"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {previewUrl && (
          <div className="mt-4">
            <p className="font-semibold">Selected Image Preview:</p>
            <img 
              src={previewUrl}
              alt="Selected image preview" 
              className="mt-2 max-w-full h-auto"
            />
          </div>
        )}
        <button 
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload to IPFS"}
        </button>
      </form>
      
      {imageCid && (
        <div className="mt-4">
          <p className="font-semibold">Uploaded Image:</p>
          <img 
            src={`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${imageCid}`}
            alt="Uploaded image" 
            className="mt-2 max-w-full h-auto"
          />
        </div>
      )}
      
      {metadataCid && (
        <div className="mt-4">
          <p className="font-semibold">Metadata CID:</p>
          <p className="break-all">{metadataCid}</p>
          <a 
            href={`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${metadataCid}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            View Metadata
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUploader;