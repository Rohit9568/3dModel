import {
  GetValueFromLocalStorage,
  LocalStorageKey,
} from "./LocalstorageUtility";

export function IsUserLoggedIn() {
  let token = GetValueFromLocalStorage<string>(LocalStorageKey.Token);
  let isLoggedIn = token != null && token.length > 0;
  return isLoggedIn;
}
