import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginService } from '../../Services';

interface UserState {
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
  userDetails: {
    email: string;
    name: string;
    role: string;
    userType: string;
  } | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  loading: false,
  error: null,
  token: null,
  userDetails: null,
};

export const login = createAsyncThunk(
  'user/login',
  async (formData: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await loginService(formData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue('Login failed. Please check your credentials.');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.userDetails = null;
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
        state.userDetails = {
          email: action.payload.email,
          name: action.payload.name,
          role: action.payload.role,
          userType: action.payload.userType,
        };
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
