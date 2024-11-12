import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
interface PdfViewerProps {
  url: string;
}
export const PdfViewer = (props: PdfViewerProps) => {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div
        style={{
          height: "100vh",
          width: "50vw",
        }}
      >
        <Viewer fileUrl={props.url} />
      </div>
    </Worker>
  );
};
