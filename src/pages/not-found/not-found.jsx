import React, {Component} from 'react';
import {
  Button,
  Row,
  Col,
} from "antd";

import './not-found.less'

export default class NotFound extends Component {

  goHome = () => {
    this.props.history.replace('/home')
  }

  render() {
    return (
      <Row className='not-found'>
        <Col className='left' span={12}></Col>
        <Col className='right' span={12}>
          <h1>404</h1>
          <h2>抱歉，你访问的页面不存在</h2>
          <Button onClick={this.goHome} type='primary'>返回首页</Button>
        </Col>
      </Row>
    )
  }
}