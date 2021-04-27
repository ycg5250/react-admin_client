import React, {Component} from 'react';
import {Form, Input, Button, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api/index'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {Redirect} from "react-router-dom";

export default class Login extends Component {

  onFinish = async (values) => {
    console.log('发送ajax登陆请求', values)
    const {username,password} = values
    // 简化promise对象的使用，不再使用then()类指定成功/失败的回调函数
    // 以同步编码方式(没有回调函数了)实现异步流程
    const response = await reqLogin(username,password)
    console.log('成功了',response.data)
    // const result = response.data
    if(response.status===0){
      message.success('登陆成功')
      const user = response.data
      memoryUtils.user = user //保存在内存
      storageUtils.saveUser(user)
      //跳转到管理界面，不需要回退到登陆界面
      this.props.history.replace('/')
    }else {
      message.error(response.msg)
    }
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
    const user = memoryUtils.user
    if (user && user._id) {
      return <Redirect to='/login'/>
    }
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className="login-content">
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

/*
  前台验证
* */

