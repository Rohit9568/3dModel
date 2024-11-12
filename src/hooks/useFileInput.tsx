import { FileInput } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { FileUpload, LargeFileUploadFrontend } from "../features/fileUpload/FileUpload";
import { showNotification } from "@mantine/notifications";
export const validateVideoFile = (file: File) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No file selected.");
    }

    const validVideoTypes = [
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/webm",
      "video/x-msvideo",
      "video/x-ms-wmv",
      "video/x-matroska",
      "video/3gpp",
      "video/3gpp2",
      "video/avi",
      "video/flv",
      "video/mkv",
      "video/ogg",
      "video/wmv",
      // Add more video MIME types as needed
    ];
    if (!validVideoTypes.includes(file.type)) {
      reject("Please upload a valid video file.");
    }

    const maxSizeInBytes = 2000 * 1024 * 1024; // 200MB in bytes
    if (file.size > maxSizeInBytes) {
      reject("File size exceeds 2 GB limit.");
    }

    resolve(file);
  });
};

function validatePDFFile(file: File) {
  return new Promise((resolve, reject) => {
    if (file.type === "application/pdf") {
      resolve("PDF file is valid");
    } else {
      reject("Invalid PDF file");
    }
  });
}

function validateImageFile(file: File) {
  return new Promise((resolve, reject) => {
    if (file.type === "image/jpeg" || file.type === "image/png") {
      resolve("Image file is valid");
    } else {
      reject("Invalid image file");
    }
  });
}

export function useFileInput(onFileUploadProgress:(progress:number)=>void) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<null | string>(null);
  const [error, setError] = useState<boolean>(false);
  const [fileType, setFileType] = useState<"video" | "image" | "pdf">("pdf");
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    console.log(file);
    if (file) {
      setFileName(file.name);
      if (fileType === "pdf") {
        setLoading(true);
        validatePDFFile(file)
          .then((validatedFile: any) => {
            FileUpload({ file })
              .then((x) => {
                setLoading(false);
                setUrl(x.url);
                setError(false);
                setFile(null);
              })
              .catch((e) => {
                setLoading(false);
                console.log(e);
                setError(true);
                setFile(null);
              });
          })
          .catch((e) => {
            setError(true);
            setFile(null);
            setLoading(false);
            showNotification({
              message: e,
            });
            console.log(e);
          });
      } else if (fileType === "video") {
        setLoading(true);
        validateVideoFile(file)
          .then((validateFile) => {
            LargeFileUploadFrontend({ file },onFileUploadProgress)
              .then((x) => {
                setLoading(false);
                setUrl(x.url.Location);
              })
              .catch((e) => {
                setLoading(false);
                console.log(e);
              });
          })
          .catch((e) => {
            setLoading(false);
            console.log(e);
            showNotification({
              message: e,
            });
            setFile(null);
          });
      } else if (fileType === "image") {
        setLoading(true);
        validateImageFile(file)
          .then((validatedFile: any) => {
            FileUpload({ file })
              .then((x) => {
                setLoading(false);
                setUrl(x.url);
                setError(false);
                setFile(null);
              })
              .catch((e) => {
                setLoading(false);
                console.log(e);
                setError(true);
                setFile(null);
              });
          })
          .catch((e) => {
            setError(true);
            setFile(null);
            setLoading(false);
            showNotification({
              message: e,
            });
            console.log(e);
          });
      } else {
        setFile(null);
        showNotification({
          message: "Please upload a valid file.",
        });
      }
    }
  }, [file]);

  return {
    isLoading,
    file,
    fileInputRef,
    url,
    setFile,
    setFileType,
    error,
    setUrl,
    fileName,
  };
}
