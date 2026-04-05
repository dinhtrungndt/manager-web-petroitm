import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from './rootReducer';

let store;

export const configureStore = () => {
  store = createStore(rootReducer, applyMiddleware(thunk));
  return store;
};

export const setStore = (newStore) => {
  store = newStore;
};

export const getStore = () => store;
