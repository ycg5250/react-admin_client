import React, {Component} from 'react'
import {
  Button,
  Card,
  Statistic,
  DatePicker,
  Timeline,
} from "antd";
import {QuestionCircleOutlined,ArrowUpOutlined,ArrowDownOutlined} from '@ant-design/icons'

import './home.less'
import HomeLine from "./home-line";
import HomeBar from "./home-bar";

const { RangePicker } = DatePicker;

/*首页*/
export default class Home extends Component {

  state = {
    isVisited:false
  }

  handleChange = (isVisited) => {
    this.setState({
      isVisited
    })
  }

  render() {
    const {isVisited} = this.state
    const title = (
      <div className="home-menu">
        <span className={isVisited ? "home-menu-active home-menu-visited" : 'home-menu-visited'}
          onClick={() => this.handleChange(true)}
        >
          访问量
        </span>
        <span className={isVisited ? "" : 'home-menu-active'} onClick={() => this.handleChange(false)}
        >
          销售量
        </span>
      </div>
    )
    return (
      <div className="home">
        <Card
          className='home-card'
          title="商品总量"
          extra={<QuestionCircleOutlined />}
          style={{ width: 250 }}
          headStyle={{color: 'rgba(0,0,0,.45)'}}
        >
          <Statistic value={112893} suffix="个" style={{fontWeight:'bolder'}}/>
          <Statistic
            value={9.3}
            precision={2}
            valueStyle={{ color: '#cf1322' ,fontSize:15}}
            prefix={<ArrowDownOutlined />}
            suffix="周同比"
          />
          <Statistic
            value={11.28}
            precision={2}
            valueStyle={{ color: '#3f8600' ,fontSize:15}}
            prefix={<ArrowUpOutlined />}
            suffix="日同比"
          />
        </Card>
        <HomeLine/>
        <Card
          className='home-content'
          title={title}
          extra={<RangePicker showTime/>}
        >
          <Card
            className="home-table-left"
            title={isVisited?'访问趋势':'销售趋势'}
            bodyStyle={{padding: 0, height: 275}}
          >
            <HomeBar/>
          </Card>
          <Card
            className="home-table-right"
            title={'任务'}
          >
            <Timeline>
              <Timeline.Item color="green">新版本迭代会</Timeline.Item>
              <Timeline.Item color="green">完成网站设计初稿</Timeline.Item>
              <Timeline.Item color="red">
                <p>联调接口</p>
                <p>功能验收</p>
              </Timeline.Item>
              <Timeline.Item color="green">
                <p>登陆功能设计</p>
                <p>权限验证</p>
                <p>页面排版</p>
              </Timeline.Item>
            </Timeline>,
          </Card>
        </Card>
      </div>
    )
  }
}