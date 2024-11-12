import { Navigate } from "react-router-dom";

import {
  GetValueFromLocalStorage,
  LocalStorageKey,
} from "./LocalstorageUtility";

export const ProtectedRoute = ({ children }: any) => {
  let token = GetValueFromLocalStorage<string>(LocalStorageKey.Token);
  let isLoggedIn = token != null && token.length > 0;

  if (isLoggedIn == false) {
    return <Navigate to="/login" />;
  }

  return children;
};
