import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

export default class AddForm extends Component {

  formRef = React.createRef()

  static propTypes = {
    categorys: PropTypes.array.isRequired,
    parentId:PropTypes.string.isRequired,
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
    const {categorys,parentId} = this.props
    return (
      <Form ref={this.formRef}>
        <Item name="parentId" initialValue={parentId}>
          <Select >
            <Option value='0'>一级分类</Option>
            {
              categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
            }
          </Select>
        </Item>

        <Item
          name="categoryName"
          initialValue=''
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