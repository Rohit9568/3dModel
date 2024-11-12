export const mimeFiles = {
  allFiles: "/",
  audio: "audio/*",
  csv: "text/csv",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  images: "image/*",
  pdf: "application/pdf",
  plainText: "text/plain",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  video: "video/*",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  zip: "application/zip",
};
// export function requestFileFromReactNative(data1: any) {
//   const data = {
//     commandType: 0,
//     ...data1,
//   };
//   const jsonData = JSON.stringify(data);
//   //@ts-ignore
//   if (window.ReactNativeWebView)
//     //@ts-ignore
//     window.ReactNativeWebView.postMessage(jsonData);
// }
