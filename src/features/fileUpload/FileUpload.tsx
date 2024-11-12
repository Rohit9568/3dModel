import axios, { AxiosProgressEvent } from "axios";
import { GetUserToken } from "../../utilities/LocalstorageUtility";


export async function FileUpload(params: { file: File }) {
  const formData = new FormData();
  formData.append("file", params.file);

  const response = await axios.post("/api/v1/fileupload/institute", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      authorization: GetUserToken(),
    },
  });

  const status = response.status;

  if (status == 200) {
    const responseData = response.data;
    return responseData;
  }

  return [];
}


export async function LargeFileUploadFrontend(
  params: { file: File },
  onProgressChanged: (progress: number) => void
) {
  //step 1 start upload and get upload Id

  const startUploadResponse = await axios.get(
    `/api/v1/fileupload/institute/startMultiPartFileUpload`,
    {
      params: {
        fileName: params.file.name,
        fileType: params.file.type
      },
      headers: {
        authorization: GetUserToken(),
      },
    }
  );

  if (startUploadResponse.status == 200) {
    const uploadId = startUploadResponse.data.uploadId;
    //step 2 - Getting Pre Signed Urls and uploading parts to those

    try {
      const fileSize = params.file.size;
      const CHUNK_SIZE = 20000000; // 10MB
      const CHUNKS_COUNT = Math.floor(fileSize / CHUNK_SIZE) + 1;
      const promisesArray = [];
      let start;
      let end;
      let blob;

      for (let index = 1; index < CHUNKS_COUNT + 1; index++) {
        start = (index - 1) * CHUNK_SIZE;
        end = index * CHUNK_SIZE;
        blob =
          index < CHUNKS_COUNT
            ? params.file.slice(start, end)
            : params.file.slice(start);


        // Get presigned URL for each part

        const getPreSignedUrlResposne = await axios.get(
          "/api/v1/fileupload/institute/getPreSignedUrl",
          {
            params: {
              fileName: params.file.name,
              partNumber: index,
              uploadId: uploadId,
              Tagging: `baseToken=${GetUserToken()}`
            },
            headers: {
              authorization: GetUserToken(),
            },
          }
        );

        const uploadProgressHandler = async (
          progressEvent: AxiosProgressEvent,
          blob: number,
          index: number
        ) => {
          if ((progressEvent?.total ?? 0) <= 0) return;
          if (progressEvent.loaded >= (progressEvent?.total ?? 0)) {
            onProgressChanged(100);
            return;
          }
          onProgressChanged(
            Math.round(
              (progressEvent.loaded * 100) / (progressEvent?.total ?? 0)
            )
          );
        };

        // upload part to aws server
        const partUploadPromise = axios.put(
          getPreSignedUrlResposne.data.url,
          blob,
          {
            onUploadProgress: (e) =>
              uploadProgressHandler(e, CHUNKS_COUNT, index),
            headers: {
              "Content-Type": params.file.type,
            },
          }
        );
        promisesArray.push(partUploadPromise);
        
      }

      const resolvedArray = await Promise.all(promisesArray);

      //Step 3 combining all promises and completeting the upload

      const uploadPartsArray: any[] = [];
      resolvedArray.forEach((resolvedPromise, index) => {
        uploadPartsArray.push({
          ETag: resolvedPromise.headers.etag,
          PartNumber: index + 1,
        });
      });


      // CompleteMultipartUpload in the backend server
      const completeMultipartUploadResponse = await axios.post(
        `/api/v1/fileupload/institute/completeMultiPartFileUpload`,
        {
          params: {
            fileName: params.file.name,
            parts: uploadPartsArray,
            uploadId: uploadId,
          },
        },{
          headers: {
            authorization: GetUserToken(),
          }
        }
      );
      if (completeMultipartUploadResponse.status == 200) {
        onProgressChanged(100);
        return completeMultipartUploadResponse.data;
      }
    } catch (err) {
      console.log(err);
    }

    return [];
  }
}

export async function UploadWordFile(params: { file: File }) {
  const formData = new FormData();
  formData.append("file", params.file);

  const response = await axios.post("/api/v1/wordUpload/test", formData, {
    headers: {
      "Content-Type": params.file.type,
      authorization: GetUserToken(),
    },
  });

  const status = response.status;

  if (status == 200) {
    const responseData = response.data;
    return responseData;
  }

  return [];
}

export async function UploadHtml(params: { file: File; files: File[] }) {
  const formData = new FormData();
  for (let i = 0; i < params.files.length; i++) {
    formData.append("files", params.files[i]);
  }
  const file2 = new File([params.file], "main.html", {
    type: params.file.type,
  });

  formData.append("files", file2);

  const response = await axios.post("/api/v1/wordUpload/html", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      authorization: GetUserToken(),
    },
  });

  const status = response.status;

  if (status == 200) {
    const responseData = response.data;
    return responseData;
  }

  return [];
}