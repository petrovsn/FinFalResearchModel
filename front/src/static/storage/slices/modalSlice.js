import { createSlice } from '@reduxjs/toolkit';

export const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    show: false,
    content: null
  },
  reducers: {
    hide_modal_content: (state) => {
      state.show = false;
      state.content = null
    },
    show_modal_content(state, action){
      state.content = action.payload
      state.show = true
    }
  }
});

export const {hide_modal_content, show_modal_content} = modalSlice.actions;
export default modalSlice.reducer;