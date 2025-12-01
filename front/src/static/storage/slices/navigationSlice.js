import { createSlice } from '@reduxjs/toolkit';

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    current_tab: "research",
    tabs_list: 
    {
      "master":["master_admin", "master_system", "master_evo", "master_mutations", "master_story", "senior_page", "doctor_page", "profile_page"],
      "senior":["senior_page", "profile_page"],
      "doctor":["doctor_page", "profile_page"],
      "subject":["profile_page"],
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