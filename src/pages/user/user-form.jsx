import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Select,
} from 'antd'

const Item = Form.Item
const Option  =Select.Option

/* 添加/修改用户的Form组件 */
export default class UserForm extends Component {

  formRef = React.createRef()

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    roles:PropTypes.array,
    user:PropTypes.object,
  }

  componentDidMount() {
    this.props.setForm(this.formRef.current)//
    // console.log(this.formRef.current)
  }

  componentDidUpdate() {
    this.formRef.current.resetFields()
  }

  render() {

    const {roles} = this.props
    const user = this.props.user || {}

    const layout = {
      //label内容所占的百分比
      labelCol: {
        span: 4,
      },
      //label后面的内容所占的百分比
      wrapperCol: {
        span: 16,
      },
    }
    return (
      <Form ref={this.formRef} {...layout}>
        <Item
          name="username"
          initialValue={user.username}
          label='用户名：'
          rules={[
            {required:true,message:'用户名称必须输入'},
          ]}
        >
          <Input placeholder='请输入用户名称'>
          </Input>
        </Item>
        {
          user._id ? null: (
            <Item
              name="password"
              initialValue={user.password}
              label='密码：'
              rules={[
                {required:true,message:'密码必须输入'},
              ]}
            >
              <Input type='password' placeholder='请输入密码'>
              </Input>
            </Item>
          )
        }

        <Item
          name="phone"
          initialValue={user.phone}
          label='手机号：'
          rules={[
            {required:true,message:'手机号必须输入'},
          ]}
        >
          <Input placeholder='请输入手机号'>
          </Input>
        </Item>
        <Item
          name="email"
          initialValue={user.email}
          label='邮箱：'
          rules={[
            {required:true,message:'邮箱必须输入'},
          ]}
        >
          <Input placeholder='请输入邮箱'>
          </Input>
        </Item>
        <Item
          name="role_id"
          initialValue={user.role_id}
          label='角色：'
          rules={[
            {required:true,message:'邮箱必须输入'},
          ]}
        >
          <Select>
            {
              roles.map((role) => {
                return <Option key={role._id} value={role._id}>{role.name}</Option>
              })
            }
          </Select>
        </Item>
      </Form>
    );
  }
}