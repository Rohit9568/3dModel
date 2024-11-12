import ApiHelper from "../../utilities/ApiHelper";
export function fetchAllSimulationfilters() {
    return new Promise((resolve, reject) => {
      ApiHelper.get(`/api/v1/simulationfilters/`)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
}
  