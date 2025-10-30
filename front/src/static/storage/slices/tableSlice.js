import { createSlice } from '@reduxjs/toolkit';

export const createTableSlice = (tableName, customReducers = {}) => {
  const initialState = {
    content: [],
    selected_item: null,
  };

  // Объединяем стандартные и кастомные редьюсеры
  const reducers = {
    // Стандартные actions
    set_content: (state, action) => { state.content = action.payload; },
    select_item: (state, action) => { state.selected_item = action.payload; },
    // Добавляем переопределения или новые actions
    ...customReducers
  };

  const slice = createSlice({
    name: `tables/${tableName}`,
    initialState,
    reducers
  });

  return {
    reducer: slice.reducer,
    actions: slice.actions // Все actions (стандартные + кастомные)
  };
};