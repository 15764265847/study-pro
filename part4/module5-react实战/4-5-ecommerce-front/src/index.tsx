import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import 'antd/dist/antd.css';

import './style.css'
import {API} from './config';
import Routes from './Routes';
import store, { history } from './store';
import AnotherStore from './anotherStore';

console.log(API)

ReactDOM.render(
  // <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ConfigProvider locale={zhCN}>
          <AnotherStore>
            <Routes></Routes>
          </AnotherStore>
        </ConfigProvider>
      </ConnectedRouter>
    </Provider>
  // </React.StrictMode>
  ,
  document.getElementById('root')
);  
