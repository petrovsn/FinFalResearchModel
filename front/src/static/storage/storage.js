import { configureStore, combineReducers   } from '@reduxjs/toolkit';
import navigationReducer from './slices/navigationSlice'
import authReducer from './slices/authSlice';
import modalReducer from './slices/modalSlice'
import makoReducer from './slices/makoSlice'
import { createTableSlice } from './slices/tableSlice';

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    auth: authReducer,
    //profiles: profilesReducer,
    modal: modalReducer,
    mako:makoReducer,
  }
});

// Добавляем метод для инжектирования редюсеров
store.injectReducer = (key, asyncReducer) => {
  // Сохраняем все асинхронные редюсеры в отдельном объекте
  if (!store.asyncReducers) {
    store.asyncReducers = {};
  }
  store.asyncReducers[key] = asyncReducer;

  // Заменяем корневой редюсер, объединяя статические и асинхронные
  store.replaceReducer(
    combineReducers({
      ...{

        navigation: navigationReducer,
        auth: authReducer,
        //profiles: profilesReducer,
        modal: modalReducer,
        mako:makoReducer,
      },
      ...store.asyncReducers,
    })
  );
};