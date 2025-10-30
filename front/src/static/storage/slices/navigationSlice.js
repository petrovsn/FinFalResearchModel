import { createSlice } from '@reduxjs/toolkit';

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    current_tab: "research",
    tabs_list: 
    {
      "master":["master_admin", "master_evo", "master_engine", "master_system", "master_story", "senior_page", "doctor_page"],
      "senior":["senior_page"],
      "doctor":["doctor_page"],
      "subject":[],
    }
    
  },
  reducers: {
    set_current_tab(state, action){
        state.current_tab = action.payload
    },
  },
});

export const {set_current_tab} = navigationSlice.actions;
export default navigationSlice.reducer;  // default export!