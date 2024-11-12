export enum LocalStorageKey {
  User = "USER",
  Token = "TOKEN",
  SimulationData = "SIMULATION_DATA",
  AskedQuestion = "ASKED_QUESTIONS",
  UserType = "USER_TYPE",
}

export function SaveValueToLocalStorage<T>(key: LocalStorageKey, value: T) {
  console.log("===============SaveValueToLocalStorage=====================");
  var jsonData = JSON.stringify(value);

  SaveToLocalStorage(key, jsonData);
}

export function RemoveValueFromLocalStorage<T>(key: LocalStorageKey) {
  localStorage.removeItem(key);
}

export function GetValueFromLocalStorage<T>(key: LocalStorageKey) {
  var jsonData = localStorage.getItem(key);
  if (jsonData != null) {
    var valueObject: T = JSON.parse(jsonData);
    return valueObject;
  }
  return null;
}

export function ClearLocalStorage() {
  localStorage.clear();
}

function SaveToLocalStorage(key: LocalStorageKey, value: string) {
  localStorage.setItem(key, value);
}

export function GetUser() {
  var localStorageUser = GetValueFromLocalStorage<string>(LocalStorageKey.User);
  if (localStorageUser == null || localStorageUser.length <= 0) return null;
  var user = JSON.parse(localStorageUser);
  return user;
}
export function GetUserToken() {
  const hardCodedToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlbW9AdmlnbmFtLmNvbSIsImlhdCI6MTY2MTIzOTU5OCwiZXhwIjoxNjkyNzc1NTk4fQ.L8aljs5bvOUSoDZINOdIHIoTRfWEXMxzfya_lNQqfZY";
  const localStorageValue = GetValueFromLocalStorage<string>(
    LocalStorageKey.Token
  );
  return localStorageValue;
}
