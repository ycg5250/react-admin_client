import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {reqWeather} from '../../api'
import menuList from "../../config/menuConfig";
import {formateDate} from '../../utils/dateUtils'
import './index.less'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import LinkButton from "../link-button";


class Header extends Component {

  state = {
    currentTime: formateDate(Date.now()), //当前时间字符串
    weather: '',
  }

  getTime = ()=>{
    this.intervalId = setInterval(()=>{
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    },1000)
  }

  getWeather = async ()=>{
    const weather = await reqWeather(110101)
    this.setState({weather})
  }

  getTitle = ()=>{
    const path = this.props.location.pathname
    let title
    menuList.forEach(item => {
      if(item.key===path){
        title = item.title
      }else if(item.children){
        //在所有的item中查找匹配
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
        //如果有值才說明有匹配
        if (cItem){
          title = cItem.title
        }
      }
    })
    return title
  }

  logout = () => {
    Modal.confirm({
      // title: '確定退出吗',
      icon: <ExclamationCircleOutlined />,
      content: '確定退出吗',
      onOk:()=>{
        storageUtils.removeUser()
        memoryUtils.user={}
        this.props.history.replace('/login')
      },
      okText: '确认',
      cancelText: '取消',
    });
  }

  componentDidMount() {
    this.getTime()
    this.getWeather()
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const {currentTime,weather} = this.state
    const username = memoryUtils.user.username
    const title = this.getTitle()
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{username}</span>
          {/*<a href="#!" onClick={this.logout}>退出</a>*/}
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span className="header-bottom-right-date">{currentTime}</span>
            <span >{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header)