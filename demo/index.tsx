import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../src/redux/modules/index';

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(<Provider store={store}>test</Provider>, document.getElementById('root') as HTMLElement);
