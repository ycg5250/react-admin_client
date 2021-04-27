import React, {Component} from 'react';
import { Card, Table, Button,message,Modal } from 'antd';
import {PlusOutlined,ArrowRightOutlined} from '@ant-design/icons';
import LinkButton from "../../components/link-button";
import {reqCategorys,reqUpdateCategory,reqAddCategory} from "../../api";
import AddForm from "./add-form";
import UpdateForm from './update-form'

/*商品分类*/
export default class Category extends Component {

  state = {
    categorys: [],//一级分类列表
    subCategorys: [],//二级分类列表
    loading: false,
    parentId: '0',
    parentName: '',
    showStatus: 0,//标识添加/更新的确认框是否显示，0：都不显示，1：显示添加，2：显示更新
  }

  initColumns = () => {
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (category) => (//返回需要显示的界面标签
          <span>
            <LinkButton onClick={()=>this.showUpdate(category)}>修改分类</LinkButton>
            {/*如何向事件回调很熟传递参数*/}
            {this.state.parentId==='0' ? <LinkButton onClick={()=>{this.showSubCategorys(category)}}>查看子分类</LinkButton> : null}
          </span>
        ),
      },
    ];
  }

  //异步获取一级分类列表，parentId：如果没有指定根据状态中的parentId请求，如果指定了根据指定的请求
  getCategorys = async (parentId) => {
    this.setState({loading:true})
    parentId = parentId || this.state.parentId  //如果parentId传了就是第一个，没有就是第二个
    const  result = await reqCategorys(parentId)
    this.setState({loading:false})
    if(result.status===0){
      //取出分类数组，可以是一级的也可能是二级的
      const categorys = result.data
      if(parentId==='0'){
        this.setState({categorys})
      }else {
        this.setState({subCategorys:categorys})
      }
    }else {
      message.error('获取分类列表失败')
    }
  }

  //显示二级列表
  showSubCategorys = (category) => {
    this.setState({
      parentId:category._id,
      parentName:category.name,
    },()=>{
      //获取二级分类列表
      this.getCategorys()
    })
  }

  //显示一级分类列表
  showCategorys = () => {
    //更新为显示一级列表的状态
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: [],
    })
  }

  //响应点击取消，隐藏确认框
  handleCancel = () => {
    this.setState({
      showStatus: 0,
    })
  }

  //显示添加的确认框
  showAdd = () => {
    console.log('showAdd')
    this.setState({
      showStatus: 1,
    })
  }

  //添加分类
  addCategory = async () => {
    console.log('addCategory')
    this.form.validateFields().then(async values => {
      this.setState({
        showStatus:0
      })
      const {parentId,categoryName} = values
      const result = await reqAddCategory(categoryName,parentId)
      // console.log(result)
      if(result.status===0){
        //添加的分类就是当前分类列表下的分类
        if(parentId===this.state.parentId){
          //重新显示分类列表
          this.getCategorys()
        }else if(parentId==='0'){//在二级分类列表下一级分类，重新获取一级分类列表，但不需要显示一级列表
          this.getCategorys('0')
        }
      }
    }).catch(errorInfo => {
      // console.log(errorInfo,typeof errorInfo)
    })
  }

  //显示修改的确认框
  showUpdate = (category) => {
    //保存分类对象
    this.category = category
    this.setState({
      showStatus: 2,
    })
  }


  //更新分类
  updateCategory = () => {
    console.log('updateCategory')
    this.form.validateFields().then(async values => {
      this.setState({
        showStatus: 0,
      })
      const categoryId = this.category._id
      const {categoryName} = values
      //发送请求更新
      const result = await reqUpdateCategory({categoryId,categoryName})
      if(result.status===0){
        //重新显示分类列表
        this.getCategorys()
      }
    }).catch(errorInfo => {
      console.log(errorInfo,typeof errorInfo)
    })
  }

  //发ajax请求，执行异步任务
  componentDidMount() {
    this.getCategorys()
  }

  //为第一次render准备数据
  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  render() {
    const extra = (
      <Button  type='primary' onClick={this.showAdd}>
        {<PlusOutlined />}
        添加
      </Button>
    )
    const {categorys,subCategorys,parentId,parentName,loading,showStatus} = this.state
    const category =this.category || {}
    const title = parentId==='0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <ArrowRightOutlined style={{marginRight:5}}/>
        <span>{parentName}</span>
      </span>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={parentId==='0' ? categorys: subCategorys}
          columns={this.columns}
          pagination={{defaultPageSize:5,showQuickJumper:true}}
        />;
        <Modal title="添加分类" visible={showStatus===1} onOk={this.addCategory} onCancel={this.handleCancel}>
          <AddForm categorys={categorys} parentId={parentId} setForm={(form) => {this.form = form}}/>
        </Modal>
        <Modal title="更新分类" visible={showStatus===2} onOk={this.updateCategory} onCancel={this.handleCancel}>
          <UpdateForm categoryName={category.name ? category.name : ''} setForm={(form) => {this.form = form}}/>
        </Modal>
      </Card>
    );
  }
}