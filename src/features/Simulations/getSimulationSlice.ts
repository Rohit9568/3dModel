import ApiHelper from "../../utilities/ApiHelper";

export function getSimulationById(params: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get<SimulationData>(`/api/v1/simulation/${params.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function fetchAllSimulation() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/simulation/`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function fetchAllSimulationBySubjectId(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/simulation/subject/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function fetchAllSimulationWithPagination(skip: number) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/simulation/pagenation/${skip}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function fetchAllSimulationWithPaginationAndFilters(
  skip: number,
  data: { labelids: string[]; type: string | null; subjectIds: string[];miscellaneous:boolean, }
) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/simulation/pagenationAndFilters/${skip}`, {
      labelids: data.labelids,
      type: data.type,
      subjectIds: data.subjectIds,
      miscellaneous:data.miscellaneous
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function getEncyptedSimulation(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/simulation/encrypt/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function getSimulationwithDecryptedId(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/simulation/decrypt/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function getMegaSimulation() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/simulation/get/megaSimulations`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function getUserSimulations() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/user/getMysimulation`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function getMysimulationwithId(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/mySimulations/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function createUserSavedSimulation(requestBody: MySimulationData) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/mySimulations/create`,requestBody )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
