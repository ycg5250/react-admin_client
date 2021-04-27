import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message,
} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import {PAGE_SIZE} from "../../utils/constants"
import {reqUsers, reqDeleteUser, reqAddOrUpdateUser} from '../../api'
import {formateDate} from "../../utils/dateUtils"
import LinkButton from "../../components/link-button"
import UserForm from './user-form'

/*用户*/
export default class User extends Component {

  state = {
    users: [], //所有用户的列表
    roles: [], //所有角色的列表
    isShow: false,
    isShowUpdate: false,
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex:'username',
      },
      {
        title: '邮箱',
        dataIndex:'email',
      },
      {
        title: '电话',
        dataIndex:'phone',
      },
      {
        title: '注册时间',
        dataIndex:'create_time',
        render:formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        // render: (role_id) => this.state.roles.find(role => role._id===role_id).name,
        render: (role_id) => this.roleNames[role_id]
      }
      ,
      {
        title: '操作',
        render: (user) => {
          // console.log(user)
          return (
            <span>
              <LinkButton onClick={() => this.shouldUpdate(user)}>修改</LinkButton>
              <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
            </span>
          )
        }
      },
    ]
  }

  initRoleNames = (roles) => {
    //map方法实现
    /*const arr = roles.map((role) => {
      return [role._id,role.name]
    })
    console.log('initRoleNames',arr)
    this.roleNames = Object.fromEntries(arr)*/

    //reduce方法实现对象存储键值
    const roleNames = roles.reduce((pre,role) => {
      pre[role._id] = role.name
      return pre
    },{})
    this.roleNames = roleNames
    // console.log(this.roleNames)
  }

  getUsers = async () => {
    const result = await reqUsers()
    if(result.status===0){
      const {users,roles} = result.data
      this.initRoleNames(roles)
      this.setState({
        users,
        roles,
      })
    }
  }

  addOrUpdateUser = () => {
    //隐藏Modal
    this.setState({isShow: false})
    this.form.validateFields().then(async values => {
      const user = values
      if(this.user){
        user._id = this.user._id
      }
      const result = await reqAddOrUpdateUser(user)
      if(result.status===0){
        message.success(`${this.user?'修改':'添加'}用户成功`)
        this.getUsers()
      }
    })
  }

  /* 显示修改界面 */
  shouldUpdate = (user) => {
    this.user = user
    this.setState({
      isShow:true
    })
  }

  /* 显示添加界面 */
  showAdd = () => {
    this.user = null  //去除前面保存的user
    this.setState({
      isShow: true
    })
  }

  deleteUser =  (user) => {
    Modal.confirm({
      title: `确认删除${user.username}`,
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const result  = await reqDeleteUser(user._id)
        if(result.status===0){
          message.success('删除用户成功')
          this.getUsers()
        }else {
          message.error('删除用户失败')
        }
      },
    })

  }

  componentDidMount() {
    this.getUsers()
  }

  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  render() {
    const {users,isShow,roles} = this.state
    const user = this.user || {}
    const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={users}
          columns={this.columns}
          pagination={{defaultPageSize:PAGE_SIZE}}
        />
        <Modal
          title={user._id?'修改用户':'添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => this.setState({isShow: false})}
        >
          <UserForm
            setForm={(form) => {this.form = form}}
            roles={roles}
            user={user}
          />
        </Modal>
      </Card>
    )
  }
}