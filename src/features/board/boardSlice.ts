import ApiHelper from "../../utilities/ApiHelper";

export function getAllBoards() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/board/getAll`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
