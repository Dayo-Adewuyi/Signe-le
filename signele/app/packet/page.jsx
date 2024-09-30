"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import SignatureCanvas from "react-signature-canvas";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment } from "react";
import { PDFDocument } from "pdf-lib";


const PDFViewer = dynamic(() => import("../components/PdfViewer"), {
  ssr: false,
  loading: () => <p>Loading PDF viewer...</p>,
});

export default function SignDocumentPage() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [signatureOpen, setSignatureOpen] = useState(false);
  const signaturePad = useRef(null);
  const [signature, setSignature] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [signaturePosition, setSignaturePosition] = useState({ x: 0, y: 0 });
  const pdfContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1); // Reset to the first page when a new document is loaded
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const blob = new Blob([new Uint8Array(e.target.result)], {
          type: "application/pdf",
        });
        setPdf(URL.createObjectURL(blob));
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const saveSignature = () => {
    const data = signaturePad.current.getTrimmedCanvas().toDataURL("image/png");
    setSignature(data);
    setSignatureOpen(false);
  };

  const clearSignature = () => {
    signaturePad.current.clear();
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = pdfContainerRef.current.getBoundingClientRect();
    setSignaturePosition({
      x: e.clientX - rect.left - 50,
      y: e.clientY - rect.top - 25,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const saveSignedPdf = async () => {
    if (!pdf || !signature) {
      alert("Please upload a PDF and add a signature first.");
      return;
    }

    const pdfDoc = await PDFDocument.load(await fetch(pdf).then(res => res.arrayBuffer()));
    const pngImage = await pdfDoc.embedPng(signature);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    firstPage.drawImage(pngImage, {
      x: signaturePosition.x,
      y: height - signaturePosition.y - 50,
      width: 100,
      height: 50,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "signed_document.pdf";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-8">Sign Document</h1>

      <div className="mb-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2"
        >
          Upload PDF
        </button>
        {pdf && <span className="text-green-600">PDF uploaded successfully!</span>}
      </div>

      <div
        className="w-full max-w-2xl border p-4 bg-white rounded-lg shadow-md mb-8 relative"
        ref={pdfContainerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {pdf ? (
          <PDFViewer
            pdf={pdf}
            pageNumber={pageNumber}
            onDocumentLoadSuccess={onDocumentLoadSuccess}
          />
        ) : (
          <div className="text-center py-10">Please upload a PDF to sign</div>
        )}

        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-200 p-2 rounded-lg"
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1 || !pdf}
          >
            Previous Page
          </button>
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <button
            className="bg-gray-200 p-2 rounded-lg"
            onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
            disabled={pageNumber >= numPages || !pdf}
          >
            Next Page
          </button>
        </div>

        {signature && (
          <img
            src={signature}
            alt="Signature"
            className="absolute cursor-move"
            onMouseDown={handleMouseDown}
            style={{
              left: `${signaturePosition.x}px`,
              top: `${signaturePosition.y}px`,
              width: "100px",
              height: "50px",
            }}
          />
        )}
      </div>

      <button
        className="bg-blue-600 text-white py-2 px-4 rounded-lg"
        onClick={() => setSignatureOpen(true)}
      >
        Add Signature
      </button>

      <Transition show={signatureOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setSignatureOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add Your Signature
                  </DialogTitle>

                  <div className="mt-2">
                    <SignatureCanvas
                      penColor="black"
                      canvasProps={{
                        className: "w-full h-48 border-2 border-gray-300",
                      }}
                      ref={signaturePad}
                    />
                  </div>

                  <div className="mt-4 flex justify-between">
                    <button
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                      onClick={clearSignature}
                    >
                      Clear
                    </button>
                    <button
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                      onClick={saveSignature}
                    >
                      Save Signature
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {signature && (
        <button
          className="bg-green-600 text-white py-2 px-4 rounded-lg mt-4"
          onClick={saveSignedPdf}
        >
          Save Signed PDF
        </button>
      )}
    </div>
  );
}
