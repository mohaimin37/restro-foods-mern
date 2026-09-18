import { createSlice } from "@reduxjs/toolkit";

const loadCart = () => {
  try {
    const data = localStorage.getItem("restro_cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const persistCart = (items) => {
  try {
    localStorage.setItem("restro_cart", JSON.stringify(items));
  } catch {
    // ignore storage errors (private browsing, quota, etc.)
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCart(),
  },
  reducers: {
    addToCart: (state, action) => {
      const { _id, name, image, price } = action.payload;
      const qty = action.payload.qty || 1;
      const existing = state.items.find((i) => i.menuItem === _id);
      if (existing) {
        existing.quantity += qty;
      } else {
        state.items.push({ menuItem: _id, name, image, price, quantity: qty });
      }
      persistCart(state.items);
    },
    incrementItem: (state, action) => {
      const item = state.items.find((i) => i.menuItem === action.payload);
      if (item) item.quantity += 1;
      persistCart(state.items);
    },
    decrementItem: (state, action) => {
      const item = state.items.find((i) => i.menuItem === action.payload);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.menuItem !== action.payload);
        }
      }
      persistCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.menuItem !== action.payload);
      persistCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persistCart(state.items);
    },
  },
});

export const { addToCart, incrementItem, decrementItem, removeFromCart, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity * i.price, 0);

export default cartSlice.reducer;
