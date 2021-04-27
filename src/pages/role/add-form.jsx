import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
} from 'antd'

const Item = Form.Item

export default class AddForm extends Component {

  formRef = React.createRef()

  static propTypes = {
    setForm: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.setForm(this.formRef.current)//
    // console.log(this.formRef.current)
  }

  componentDidUpdate() {
    this.formRef.current.resetFields()
  }

  render() {
    return (
      <Form ref={this.formRef}>
        <Item
          name="roleName"
          initialValue=''
          label='角色名称'
          rules={[
            {required:true,message:'角色名称必须输入'},
          ]}
        >
          <Input placeholder='请输入角色名称'>
          </Input>
        </Item>
      </Form>
    );
  }
}