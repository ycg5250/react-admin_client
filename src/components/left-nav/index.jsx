import React, {Component} from 'react';
import {Link,withRouter} from "react-router-dom";
import { Menu } from 'antd';
import {connect} from "react-redux";

import menuList from "../../config/menuConfig";
import './index.less'
import logo from '../../assets/images/logo.png'
import {setHeadTitle} from "../../redux/actions";

const { SubMenu } = Menu;

class LeftNav extends Component {

  //根据menu的数据数组生成对应的标签数组
  //使用map() + 递归调用
  getMenuNodes_map = menuList=> {
    return menuList.map((item)=>{
    /*
      {
        title: '首页', // 菜单标题名称
        key: '/home', // 对应的path
        icon: {PieChartOutlined}, // 图标名称
        isPublic: true, // 公开的
        children:[]
      },
     */
      if (!item.children) {
        return (
          <Menu.Item key={item.key} icon={<item.icon />}>
            <Link to={item.key}>
              {item.title}
            </Link>
          </Menu.Item>
        )
      }else {
        return (
          <SubMenu key={item.key} icon={<item.icon />} title={item.title}>
            {
              this.getMenuNodes(item.children)
            }
          </SubMenu>
        )
      }
    })
  }

  /* 判断当前登录用户对item是否有权限 */
  hasAuth = (item) => {
    const {key,isPublic} = item
    const menus = this.props.user.role.menus
    const username = this.props.user.username
    // console.log(username)
    if(username==='admin' || isPublic || menus.indexOf(key)!==-1){
      return true
    }else if(item.children){//如果当前用户有次item的某个item的权限
      return !!item.children.find(child => menus.indexOf(child.key)!==-1)
    }
    return false

    /*
    1.如果当前用户是admin
    2.如果当前item是公开的
    3.当前用户有此item的权限：key有没有在menus中
    */
  }

  //根据menu的数据数组生成对应的标签数组
  //reduce() + 递归调用
  getMenuNodes = menuList => {
    //得到当前请求的路由路径
    const path = this.props.location.pathname

    //如果当前用户有item对应的权限，才需要显示对应的菜单项
    return menuList.reduce((pre,item)=>{
      if(this.hasAuth(item)){
        //向pre添加<Menu.Item>
        if (!item.children) {
          // 判断item是否是当前对应的item
          if(item.key===path || path.indexOf(item.key)===0){
            //更新redux的状态
            this.props.setHeadTitle(item.title)
          }
          pre.push((
            <Menu.Item key={item.key} icon={<item.icon />}>
              <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                {item.title}
              </Link>
            </Menu.Item>
          ))
        }else {//向pre添加<SubMenu>
          //查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
          //如果存在，说明当前item的子列表需要打开
          if (cItem) {
            this.openKey = item.key
          }

          pre.push((
            <SubMenu key={item.key} icon={<item.icon />} title={item.title}>
              {
                this.getMenuNodes(item.children)
              }
            </SubMenu>
          ))
        }
      }
      return pre
    },[])
  }

  //在第一次render()之前执行一次
  //为第一个render()准备数据(必须同步的)
  UNSAFE_componentWillMount() {
    this.menNodes = this.getMenuNodes(menuList)
  }

  render() {
    //得到当前请求的路由路径
    let path = this.props.location.pathname
    // console.log(path)
    if(path.indexOf('/product')===0){//当前请求的是商品或者其子路由界面
      path = '/product'
    }
    const openKey = this.openKey
    return (
      <div className="left-nav">
        <Link to='/' className="left-nav-header">
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </Link>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[path]}
          // selectedKeys={[this.props.headTitle]}
          defaultOpenKeys={[openKey]}
        >
          {
            this.menNodes
          }
        </Menu>
      </div>
    );
  }
}


/*
withRouter高阶组件
包装非路由组件，返回一个新组建
新的组件向非路由组件传递3个属性：history/location/match
*/
export default connect(
  state => ({user:state.user}),
  {setHeadTitle},
)(withRouter(LeftNav))