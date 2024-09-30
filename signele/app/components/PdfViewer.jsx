"use client";
import React from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Set up the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.9.179/build/pdf.worker.min.js`;

export default function PDFViewer({ pdf, pageNumber, onDocumentLoadSuccess }) {
  return (
    <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess} error={<div>Failed to load PDF.</div>}>
      <Page pageNumber={pageNumber} />
    </Document>
  );
}
