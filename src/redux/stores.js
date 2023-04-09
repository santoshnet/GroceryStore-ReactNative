// Customizable Area Start
import {applyMiddleware, combineReducers, createStore} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';
import userAddressReducer from './userAddress/reducers';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  userAddressReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const stores = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(stores);

// const stores = createStore(rootReducer, applyMiddleware(thunk));

// export default stores;
// Customizable Area End
