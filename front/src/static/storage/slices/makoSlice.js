import { createSlice } from '@reduxjs/toolkit';

const makoSlice = createSlice({
  name: 'mako',
  initialState: {
    mako_blocks: {
      "nerves": [],
      "skin":[]
    },
    mako_prediction: {
      "name": "string",
      "stats": {
        "nerves": 0,
        "skin": 0
      },
      "mako_plus": 0,
      "mako_minus": 0
    }
  },
  reducers: {
    add_new_block(state, action) {
      let tissue_type = action.payload["tissue_type"]
      console.log("mako add_new_block", )
      let new_mako_blocks = state.mako_blocks[tissue_type]
      new_mako_blocks.push({
        "A": 0,
        "phi": 0,
        "duration": 0,
      })
      state.mako_blocks[tissue_type] = new_mako_blocks
    },
    delete_block(state, action) {
      let tissue_type = action.payload["tissue_type"]
      console.log("mako add_new_block", action.payload)
      let new_mako_blocks = state.mako_blocks[tissue_type]
      new_mako_blocks.splice(action.payload["idx"], 1)
      state.mako_blocks[tissue_type] = new_mako_blocks
      console.log("mako add_new_block", new_mako_blocks)
    },
    set_block_params(state, action) {
      let tissue_type = action.payload["tissue_type"]
      console.log("mako set_block_params", action.payload)
      let new_mako_blocks = state.mako_blocks[tissue_type]
      new_mako_blocks[action.payload["idx"]] = action.payload["params"]
      state.mako_blocks[tissue_type] = new_mako_blocks
    },
    update_prediction(state, action) {
      state.mako_prediction = action.payload
    }
  },
});

export const { add_new_block, delete_block, set_block_params, update_prediction } = makoSlice.actions;
export default makoSlice.reducer;  // default export!