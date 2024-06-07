import {combineReducers} from 'redux';
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// slices import
import userReducer from './slices/userSlice';
import loadingReducer from './slices/loading';

// persist redux import
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

// combine reducer
const rootReducer = combineReducers({
  user: userReducer,
  loading: loadingReducer,
});

// persist redux config
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blacklist: ['loading'], // not persist data
};

// create persist store
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
    },
  }),
  devTools: true,
});

export const persistor = persistStore(store);
export default store;
