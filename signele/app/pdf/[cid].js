'use client';

import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import { useSearchParams } from 'next/navigation';

export default function PdfViewerWithSign() {
  const [pdf, setPdf] = useState(null);
  const [isSigning, setIsSigning] = useState(false);
  const sigCanvas = React.useRef({});
  const searchParams = useSearchParams();
  const cid = searchParams.get('cid'); 

  useEffect(() => {
    const fetchPdf = async () => {
      const response = await fetch(`/api/download?cid=${cid}`);
      const blob = await response.blob();
      setPdf(URL.createObjectURL(blob));
    };

    if (cid) fetchPdf();
  }, [cid]);

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  return (
    <div>
      {pdf ? (
        <div>
          <Document file={pdf} onLoadError={console.error}>
            <Page pageNumber={1} />
          </Document>
          <button onClick={() => setIsSigning(!isSigning)}>
            {isSigning ? 'Stop Signing' : 'Start Signing'
          }</button>
          {isSigning && (
            <div>
              <SignatureCanvas
                penColor="black"
                canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                ref={sigCanvas}
              />
              <button onClick={clearSignature}>Clear Signature</button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
}