import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree,
} from 'antd'

import menuList from "../../config/menuConfig";

const Item = Form.Item


export default class AuthForm extends Component {

   formRef = React.createRef()

  static propTypes = {
    role:PropTypes.object
  }

  constructor(props) {
    super(props);
    const {menus} = this.props.role
    this.state = {
      checkedKeys: menus
    }
  }

  /* 为父组件提交获取最新menus数据的方法  */
  getMenus = () => this.state.checkedKeys


  getTreeData = (menuList) => {
    this.treeData = [
      {
        title: '平台权限',
        key: 'all',
      }
    ]
    const menuListArr = Object.values(menuList)
    // console.log('menuListArr',menuListArr)
    this.treeData[0].children = menuListArr
    // console.log('this.treeData',this.treeData)
  }

  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
    this.setState({checkedKeys})
  };

  //根据传入的role来更新checkedKeys状态
  //当组件接收到新的属性时自动调用
  UNSAFE_componentWillReceiveProps(nextProps) {
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys:menus
    })
    //这样更新也是可行的，因为我不是要产生新的更新
    // UNSAFE_componentWillReceiveProps 本来就在更新的流程上
    //所以我只需要改变状态只
    // this.state.checkedKeys = menus
  }

  UNSAFE_componentWillMount() {
    this.getTreeData(menuList)
  }

  componentDidMount() {
    // this.props.setForm(this.formRef.current)//
    // console.log(this.formRef.current)
  }

  componentDidUpdate() {
     this.formRef.current.resetFields()
  }

  render() {
    const {role} = this.props
    const {checkedKeys} = this.state
    // console.log(role)
    console.log('AuthForm render()')
    return (
      <Form ref={this.formRef}>
        <Item
          name="roleName"
          initialValue={role.name}
          label='角色名称'
        >
          <Input disabled/>
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          // checkedKeys={role.menus}
          onSelect={this.onSelect}
          onCheck={this.onCheck}
          treeData={this.treeData}
        />
      </Form>
    );
  }
}