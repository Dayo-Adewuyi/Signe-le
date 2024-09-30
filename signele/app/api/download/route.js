import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const cid = searchParams.get('cid');

  if (!cid) {
    return new NextResponse.json({ error: 'CID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://gateway.lighthouse.storage/ipfs/${cid}`);
    if (!response.ok) {
      throw new Error('Failed to download the file from IPFS');
    }

    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  } catch (error) {
    console.error('Error while downloading/serving the file:', error);
    return NextResponse.json({ error: 'Failed to download or serve the file' }, { status: 500 });
  }
}