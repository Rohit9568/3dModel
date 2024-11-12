import ApiHelper from "../../utilities/ApiHelper";

export function fetchSearch(query: string) {
    return new Promise((resolve, reject) => {
      ApiHelper.get(`/api/v1/search?queryValue=${query}`)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }