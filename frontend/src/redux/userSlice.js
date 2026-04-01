import { createSlice } from "@reduxjs/toolkit";

//  استرجاع المستخدم من localStorage عند بداية التطبيق
const savedUser = localStorage.getItem("user");

const initialState = {
  currentUser: savedUser ? JSON.parse(savedUser) : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;

      //  حفظ المستخدم في localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));

      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    },

    logoutUser: (state) => {
      state.currentUser = null;

      // حذف بيانات اليوزر من التخزين
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
