import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducer from '../share/store/reducers/index';

const store = createStore(reducer, window.INITAL_STATE, applyMiddleware(thunk))

export default store