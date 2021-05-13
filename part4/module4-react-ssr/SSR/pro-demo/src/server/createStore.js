import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducer from '../share/store/reducers';

export default () => {
  return createStore(reducer, {}, applyMiddleware(thunk))
}