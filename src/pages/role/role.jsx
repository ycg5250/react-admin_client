import React, {Component} from 'react';
import {
  Card,
  Button,
  Table, Modal, message
} from 'antd'
import {PAGE_SIZE} from "../../utils/constants";
import {reqRoles} from '../../api'
import AddForm from "./add-form";
import AuthForm from './auth-form'
import {reqAddRole,reqUpdateRole} from '../../api'
import memoryUtils from "../../utils/memoryUtils";
import {formateDate} from "../../utils/dateUtils";
import storageUtils from "../../utils/storageUtils";

/*角色管理*/
export default class Role extends Component {

  auth = React.createRef()

  state = {
    roles: [], //所有角色的列表
    role: {}, //选中的role
    isShowAdd: false,
    isShowAuth: false,
  }

  initColumns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex:'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => formateDate(create_time)
      },
      {
        title: '授权时间',
        dataIndex:'auth_time',
        render:formateDate
      },
      {
        title: '授权人',
        dataIndex:'auth_name',
      },
    ]
  }

  onRow = (role) => {
    return {
      onClick: event => {
        // console.log('onRow',role)
        this.setState({
          role
        })
      },
    }
  }

  getRoles = async () => {
    const result = await reqRoles()
    if(result.status===0){
      const roles = result.data
      this.setState({
        roles
      })
    }
  }

  addRole = async (name) => {
    this.form.validateFields().then( async values => {
      const {roleName} = values
      this.setState({isShowAdd:false})
      const result = await reqAddRole(roleName)
      if(result.status===0){
        message.success(`${roleName}添加成功`)
        const roles = result.data
        //更新roles状态，基于原本状态数据更新
        this.setState(state => ({
          roles: [...state.roles,roles]
        }))
      }else {
        message.error(`${roleName}添加失败`)
      }
    })
  }

  //更新角色
  updateRole = async () => {
    this.setState({
      isShowAuth:false
    })
    const role = this.state.role
    //得到最新的menus
    const menus = this.auth.current.getMenus()
    role.menus = menus
    // console.log(role.menus)
    role.auth_name = memoryUtils.user.username
    role.auth_time = Date.now()
    const result = await reqUpdateRole(role)
    if(result.status===0){
      //如果当前更新的是自己角色的权限，强制退出
      if(role._id === memoryUtils.user.role_id){
        memoryUtils.user = {}
        storageUtils.removeUser()
        this.props.history.replace('/login')
        message.success('更新用户角色权限更改了，重新登录')
      }else {
        message.success('更新角色权限成功')
        this.setState({
          roles: [...this.state.roles]
        })
      }
    }else {
      message.error('更新角色权限失败')
    }
  }

  componentDidMount() {
    this.getRoles()
  }

  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  render() {
    // console.log('role render()')
    const {roles,role,isShowAdd,isShowAuth} = this.state
    const title = (
      <span>
        <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button> &nbsp;&nbsp;
        <Button type='primary' onClick={() => this.setState({isShowAuth: true})} disabled={!role._id}>设置角色权限</Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          pagination={{defaultPageSize:PAGE_SIZE}}
          rowSelection={{
            type: 'radio',
            selectedRowKeys:[role._id],
            onSelect: (role) => {
              this.setState({
                role
              })
            }
          }}
          onRow={this.onRow}
        />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => this.setState({isShowAdd: false})}
        >
          <AddForm setForm={(form) => {this.form = form}}/>
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}  //更新角色
          onCancel={() => this.setState({isShowAuth: false})}
        >
          <AuthForm ref={this.auth} role={role}/>
        </Modal>
      </Card>
    );  
  }
}