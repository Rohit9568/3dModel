import ApiHelper from "../../utilities/ApiHelper";

export function FileDelete(data:{
    fileName:string
  }) 
  {
      return new Promise((resolve, reject) => {
        ApiHelper.delete(`/api/v1/fileUpload/institute?fileName=${data.fileName}`)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
  }