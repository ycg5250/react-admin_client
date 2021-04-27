import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input
} from 'antd'

const Item = Form.Item
// const [form] = Form.useForm



export default class UpdateForm extends Component {

   formRef = React.createRef()

  static propTypes = {
    categoryName:PropTypes.string.isRequired,
    setForm:PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.setForm(this.formRef.current)//
    // console.log(this.formRef.current)
  }

  componentDidUpdate() {
    // this.formRef.current.setFieldsValue({
    //   categoryName: this.props.categoryName,
    // });
      this.formRef.current.resetFields()
  }

  render() {
    const {categoryName} = this.props
    // console.log(this.props)
    return (
      <Form ref={this.formRef} onFinish={this.onFinish}>
        <Item
          name="categoryName"
          initialValue={categoryName}
          rules={[
            {required:true,message:'分类名称必须输入'},
          ]}
        >
          <Input placeholder='请输入分类名称'>
          </Input>
        </Item>
      </Form>
    );
  }
}