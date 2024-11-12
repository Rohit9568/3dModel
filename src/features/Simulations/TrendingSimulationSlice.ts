import ApiHelper from "../../utilities/ApiHelper";

export function fetchTrendingSimulations() {
  return new Promise((resolve, reject) => {
    ApiHelper.get<TrendingSimulation[]>(`/api/v1/trendingsimulation`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
