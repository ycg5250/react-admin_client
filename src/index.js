/*
  入口js
* */
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'

import store from './redux/store'
import App from './App';
import 'antd/dist/antd.css'
import storageUtils from "./utils/storageUtils";
import memoryUtils from "./utils/memoryUtils";

//读取local中保存的user，保存到内存中
memoryUtils.user = storageUtils.getUser()


ReactDOM.render((
    <Provider store={store}>
      <App/>
    </Provider>
  ),
  document.getElementById('root')
);

