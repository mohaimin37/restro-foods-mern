import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyFavorites, addFavorite as addFavoriteApi, removeFavorite as removeFavoriteApi } from "../../api/favoriteApi";

export const fetchFavorites = createAsyncThunk("favorites/fetch", async (_, { rejectWithValue }) => {
  try {
    const data = await getMyFavorites();
    return data.favorites;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const toggleFavorite = createAsyncThunk(
  "favorites/toggle",
  async (dish, { getState, rejectWithValue }) => {
    try {
      const isFavorited = getState().favorites.items.some((f) => f._id === dish._id);
      if (isFavorited) {
        await removeFavoriteApi(dish._id);
        return { removed: dish._id };
      }
      await addFavoriteApi(dish._id);
      return { added: dish };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: { items: [], loaded: false },
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
      state.loaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loaded = true;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (action.payload.added) {
          state.items.push(action.payload.added);
        } else if (action.payload.removed) {
          state.items = state.items.filter((f) => f._id !== action.payload.removed);
        }
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export const selectIsFavorite = (dishId) => (state) =>
  state.favorites.items.some((f) => f._id === dishId);
export default favoritesSlice.reducer;
