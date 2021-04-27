import React, {Component} from 'react';
import { Layout } from 'antd';
import {Redirect,Route,Switch} from 'react-router-dom'
import memoreUtils from "../../utils/memoryUtils";

import LeftNav from "../../components/left-nav";
import Header from "../../components/herder";
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import Role from "../role/role";

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
  render() {
    const user = memoreUtils.user
    if(!user || !user._id){
      //自动跳转到登陆界面
      return <Redirect to='/login'/>
    }
    return (
      <Layout style={{minHeight:'100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{margin:20,backgroundColor:'#fff'}}>
            <Switch>
              <Route path='/home' component={Home}/>
              <Route path='/category' component={Category}/>
              <Route path='/product' component={Product}/>
              <Route path='/role' component={Role}/>
              <Route path='/user' component={User}/>
              <Route path='/charts/bar' component={Bar}/>
              <Route path='/charts/line' component={Line}/>
              <Route path='/charts/pie' component={Pie}/>
              <Redirect to='/home'/>
            </Switch>
          </Content>
          <Footer style={{textAlign:'center',color:'#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    );
  }
}