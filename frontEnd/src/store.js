//store to mantain global states for our app usng redux toolKit!

import { configureStore } from '@reduxjs/toolkit';
import authenticationReducer from './Reducers/authenticationReducer';

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
  },
});

export default store;
