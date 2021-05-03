import React, {Component} from 'react';
import {Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";

import './login.less'
import logo from '../../assets/images/logo.png'
import {login} from "../../redux/actions";


class Login extends Component {

  onFinish = async (values) => {
    const {username,password} =values
    this.props.login(username,password)
  };

  //自定义验证规则
  validatorPwd = (rule, value)=>{
    if(!value){
      return Promise.reject(new Error('密码必须输入'))
    }else if(value.length < 4){
      return Promise.reject(new Error('密码长度不能小于4位'))
    }else if(value.length > 12){
      return Promise.reject(new Error('密码长度不能大于12位'))
    }else if(!/^[a-zA-z0-9_]+$/.test(value)){
      return Promise.reject(new Error('密码必须是英文数字下划线组成'))
    }else {
      return Promise.resolve()
    }
  }

  render() {
    //如果用户已经登陆，自动跳转到管理界面
    const user = this.props.user
    if (user && user._id) {
      return <Redirect to='/home'/>
    }
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className="login-content">
          <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
          <h2>用户登录</h2>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="username"
              //声明式验证，直接使用别人定义好的验证规则进行验证
              rules={[
                {required: true, whitespace:true, message: '请输入用户名',},
                {max: 12, message: '用户名最多12位',},
                {min: 4, message: '用户名至少4位',},
                {pattern: /^[a-zA-z0-9_]+$/, message: '用户名必须是英文数字下划线组成',},
              ]}
              initialValue = 'admin'
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="用户名"
                autoComplete="current-password"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                // {required: true, message: '请输入密码',},
                {validator: this.validatorPwd},
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
                autoComplete="current-password"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}


export default connect(
  state => ({user:state.user}),
  {login}
)(Login)

/*
  前台验证
* */

