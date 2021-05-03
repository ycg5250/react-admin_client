/*
用来根据老的state和指定的action生成并返回新的state的函数
*/
import {combineReducers} from 'redux'

import storageUtils from "../utils/storageUtils";
import {
  SET_HEAD_TITLE,
  RECEIVE_USER,
  SHOW_ERROR_MEG,
  RESET_USER,
} from './action-types'


const initHeadTitle = '首页'

function headTitle(state=initHeadTitle,action){
  // console.log('headTitle',state,action)
  switch (action.type) {
    case SET_HEAD_TITLE:
      return action.data
    default:
      return state
  }
}

/* 用来管理当前登陆用户的reducer函数 */
const initUser = storageUtils.getUser()

function user(state=initUser,action){
  switch (action.type) {
    case RECEIVE_USER:
      return action.user
    case SHOW_ERROR_MEG:
      const errorMsg = action.errorMsg
      // state.errorMsg = errorMsg   错误写法，不用直接修改原来的状态数据，而是要产生新的
      return {...state,errorMsg}
    case RESET_USER:
      return {}
    default:
      return state
  }
}

/*
向外默认暴露的是合并产生的总的reducer函数
管理的总的state结构：
  {
    hearTitle: '首页',
    user: {},
  }
*/
export default combineReducers({
  headTitle,
  user,
})