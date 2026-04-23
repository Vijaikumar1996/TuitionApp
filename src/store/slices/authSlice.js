import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, logoutApi } from "../../services/authService";
import { jwtDecode } from "jwt-decode";

// 🔥 Restore token & user on app load
const token = localStorage.getItem("token");

let user = null;

if (token) {
  try {
    //user = jwtDecode(token);
    const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
    user = {
      ...jwtDecode(token),
      ...userDetails
    };
    console.log("Restored user from token:", user);
  } catch (err) {
    console.error("Invalid token");
    localStorage.removeItem("token");
  }
}

// 🔥 Async login action
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      console.log("Login Response:", response);

      const token = response.data.Token;

      const userDetails = {
        InstituteName: response.data.InstituteName,
        name: response.data.Name,
        email: response.data.Email,
        mobileNo: response.data.MobileNo,
      }

      // 🔥 Save token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userDetails", JSON.stringify(userDetails));

      // 🔥 Decode token
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded);

      return {
        token,
        user: {
          ...decoded,
          ...userDetails
        }
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: user,   // 🔥 restored from token
    token: token, // 🔥 restored from localStorage
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;

      // 🔥 Remove token
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        // 🔥 Save user & token
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;

        localStorage.removeItem("token");
      });

  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;