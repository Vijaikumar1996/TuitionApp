import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "../../services/authService";
import { jwtDecode } from "jwt-decode";

// 🔥 Restore token & user on app load
const token = localStorage.getItem("token");

let user = null;

if (token) {
  try {
    user = jwtDecode(token);
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

      // 🔥 Save token in localStorage
      localStorage.setItem("token", token);

      // 🔥 Decode token
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded);

      return {
        token,
        user: decoded,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
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
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;