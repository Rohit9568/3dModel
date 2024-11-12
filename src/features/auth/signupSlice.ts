import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LoadingState } from "../LoadingState.d";
import axios from "axios";
import {
  LocalStorageKey,
  SaveValueToLocalStorage,
} from "../../utilities/LocalstorageUtility";
import { User } from "../../@types/User";

interface SignUpState {
  loadingState: LoadingState;
  value?: {
    token: string;
    status: number;
    user: User;
  } | null;
  error: any;
}

const initialState: SignUpState = {
  loadingState: LoadingState.IDLE,
  value: undefined,
  error: null,
};

export const signUpUser = createAsyncThunk(
  "Auth/Login",
  async (params: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone:string,
    subjects:any[]
  }) => {
    const response = await axios.post(`/api/v1/auth/signup`, {
      email: params.email,
      password: params.password,
      name: params.name,
      role: params.role,
      phone:params.phone,
      subjects:params.subjects
    });

    const status = response.status;

    if (status === 200) {
      const responseData = response.data;

      return responseData;
    }

    return null;
  }
);

export const signUpSlice = createSlice({
  name: "Auth/Signup",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state, action) => {
        state.loadingState = LoadingState.REQUESTED;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
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
              homeworkToken:userResponse.user.homeworkshareToken
            })
          );
          SaveValueToLocalStorage(LocalStorageKey.Token, userResponse.token);
        }
        state.loadingState = LoadingState.DATA_FETECHED;
        state.error = null;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loadingState = LoadingState.ERROR;
        state.error = action.error;
      });
  },
});

export default signUpSlice.reducer;
