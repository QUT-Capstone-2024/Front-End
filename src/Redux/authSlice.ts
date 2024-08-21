import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginService } from '../Services/userServices';

interface AuthState {
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  loading: false,
  error: null,
  token: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (formData: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await loginService(formData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue('Login failed. Please check your credentials.');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;