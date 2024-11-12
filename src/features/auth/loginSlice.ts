import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LoadingState } from "../LoadingState.d";
import axios from "axios";
import {
  LocalStorageKey,
  RemoveValueFromLocalStorage,
  SaveValueToLocalStorage,
} from "../../utilities/LocalstorageUtility";
import { User } from "../../@types/User";

interface LoginState {
  loadingState: LoadingState;
  value?: {
    token: string;
    status: number;
    user: User;
    userType: string;
  } | null;
  error: any;
}

const initialState: LoginState = {
  loadingState: LoadingState.IDLE,
  value: undefined,
  error: null,
};

export const loginUser = createAsyncThunk(
  "Auth/Login",
  async (params: { email: string; password: string }) => {
    const response = await axios.post(`/api/v1/auth/signin`, {
      email: params.email,
      password: params.password,
    });
    const status = response.status;
    if (status == 200) {
      const responseData = response.data;
      return responseData;
    } else return response.data;
    // return null;
  }
);

export const loginSlice = createSlice({
  name: "Auth/Login",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      RemoveValueFromLocalStorage(LocalStorageKey.Token);
      RemoveValueFromLocalStorage(LocalStorageKey.User);
      state.value = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.loadingState = LoadingState.REQUESTED;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload != null) state.value = action.payload;
        var userResponse = state.value;

        if (userResponse != null) {
          SaveValueToLocalStorage(
            LocalStorageKey.User,
            JSON.stringify({
              _id: userResponse.user._id,
              email: userResponse.user.email,
              name: userResponse.user.name,
              role: userResponse.user.role,
              homeworkToken: userResponse.user.homeworkshareToken,
              instituteId: userResponse.user.instituteId._id,
              phone: userResponse.user.phoneNo,
              instituteName: userResponse.user.instituteId.name,
            })
          );
          SaveValueToLocalStorage(LocalStorageKey.Token, userResponse.token);
          SaveValueToLocalStorage(
            LocalStorageKey.UserType,
            userResponse.user.role
          );
        }
        state.loadingState = LoadingState.DATA_FETECHED;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loadingState = LoadingState.ERROR;
        state.error = action.error;
      });
  },
});

export default loginSlice.reducer;
