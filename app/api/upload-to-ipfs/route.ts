import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const pinataFormData = new FormData();
    pinataFormData.append('file', new Blob([bytes]), file.name);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': process.env.PINATA_API_KEY!,
        'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY!,
      },
      body: pinataFormData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ ipfsHash: data.IpfsHash });
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return NextResponse.json({ error: 'Error uploading to IPFS' }, { status: 500 });
  }
}