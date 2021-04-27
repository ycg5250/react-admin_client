import React, {Component} from 'react';
import {
  Card,
  Input,
  Form,
  Cascader,
  Button, message,
} from 'antd'
import {ArrowLeftOutlined} from "@ant-design/icons";

import PicturesWall from './pictures-wall'
import LinkButton from '../../components/link-button'
import {reqCategorys,reqAddOrUpdateProduct} from '../../api'
import RichTextEditor from './rich-text-editor'


const {Item} = Form
const {TextArea} = Input


/*是product的添加和更新子路组件*/
export default class ProductAddUpdate extends Component {

  state = {
    optionLists:[],
  }

  formRef = React.createRef()
  pw = React.createRef()
  editor = React.createRef()

  //
  initOptionLists = async (categorys) => {
    //根据categorys生成optionLists数组
    const optionLists = categorys.map((category) => ({
      value:category._id,
      label:category.name,
      isLeaf:false,
    }))

    //如果是一个二级分类商品的更新
    const {isUpdate,product} = this
    const {pCategoryId,categoryId} = product
    if(isUpdate && pCategoryId!=='0'){
      //获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      //生成二级下拉列表的optionLists
      const childOptionLists = subCategorys.map(c=>({
        value:c._id,
        label:c.name,
        isLeaf:true,
      }))
      //找到当前商品对应的一级optionLists对象
      const targetOption = optionLists.find(optionList => optionList.value===pCategoryId)
      //关联对应的一级optionLists
      targetOption.children = childOptionLists
    }

    this.setState({
      optionLists
    })
  }

  //获取一级/二级分类列表
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if(result.status===0){
      const categorys = result.data
      if(parentId==='0'){//一级分类列表
        this.initOptionLists(categorys)
      }else {//二级分类列表
        return categorys //返回二级列表 ==>当前async函数返回的promise就会成功且value为categorys
      }
    }
  }

  //用于加载下一级列表的回调函数
  loadData = async selectedOptions => {
    //得到选择的optionList对象
    const targetOption = selectedOptions[0];
    //显示loading
    targetOption.loading = true;

    //根据选中的分类，请求加载二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false
    if(subCategorys && subCategorys.length>0){
      //生成一个二级列表的optionLists
      const childOptionLists = subCategorys.map((subCategory) => ({
        value:subCategory._id,
        label:subCategory.name,
        isLeaf:true,
      }))
      targetOption.children = childOptionLists
    }else {//当前选中的分类没有二级分类
      targetOption.isLeaf=true
    }
    this.setState({
      optionLists:[...this.state.optionLists]
    })
  }

  validatorPrice = (rule,value) => {
    // console.log(value,typeof value)
    if (value*1<0) {
      return Promise.reject((new Error('输入的价格必须大于0')))
    }else {
      return Promise.resolve()
    }
  }

  submit = () => {
    // debugger
    //进行表单验证，如股份通过了才发送请求
    this.formRef.current.validateFields().then(async values => {//验证通过
      // 1.收集数据，冰封装成product对象
      const {name,desc,price,categoryIds} = values
      let pCategoryId,categoryId
      if(categoryIds.length===1){
        pCategoryId = '0'
        categoryId = categoryIds[0]
      }else {
        pCategoryId = categoryIds[0]
        categoryId = categoryIds[1]
      }
      const imgs = this.pw.current.getImgs()
      const detail = this.editor.current.getDetail()
      const product = {name,desc,price,imgs,detail,pCategoryId,categoryId}
      if(this.isUpdate){
        product._id = this.product._id
      }
      // 2.调用接口请求函数去添加/更新
      const result = await reqAddOrUpdateProduct(product)
      if(result.status===0){
        message.success(`${this.isUpdate?'更新':'添加'}商品成功`)
        this.props.history.goBack()
      }else{
        message.error(`${this.isUpdate?'更新':'添加'}商品失败`)
      }

      // 3.根据结果提示

      // console.log('submit()',values)
      // console.log(imgs,detail)
    }).catch(errorInfo => {//验证不通过
      // console.log(errorInfo,typeof errorInfo)
    })
  }

  componentDidMount() {
    this.getCategorys('0')
    // console.log(this.formRef.current)
  }

  UNSAFE_componentWillMount() {
    const product = this.props.location.state //如果是添加没值，否则有值
    //保存是否是更新的标识
    this.isUpdate = !!product
    this.product = product || {}
  }

  render() {

    const {isUpdate,product} = this
    const {pCategoryId,categoryId,imgs,detail} = product
    const categoryIds = []
    if(isUpdate){
      if(pCategoryId==='0'){
        //商品是一个一级分类的商品
        categoryIds.push(categoryId)
      }else {
        //商品是一个二级分类的商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }

    }

    const title = (
      <span>
        <LinkButton>
          <ArrowLeftOutlined
            style={{color:'green',marginRight:10}}
            onClick={()=>this.props.history.goBack()}
          />
        </LinkButton>
        <span>{isUpdate?'修改商品':'添加商品'}</span>
      </span>
    )

    //指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 2 }, //左侧label的宽度
      wrapperCol: { span: 8 }, //指定右侧包裹的宽度
    };

    const {optionLists} = this.state
    //
    return (
      <Card title={title}>
        <Form ref={this.formRef} {...formItemLayout}>
          <Item
            label='商品名称'
            name='name'
            initialValue={product.name}
            rules={[
              {required:true,message:'商品名称必须输入'},
            ]}
          >
            <Input placeholder='请输入商品名称'/>
          </Item>
          <Item
            label='商品描述'
            name='desc'
            initialValue={product.desc}
            rules={[
              {required:true,message:'商品描述必须输入'},
            ]}
          >
            <TextArea placeholder='请输入商品描述' showCount maxLength={100} autoSize={{ minRows: 2, maxRows: 6 }}/>
          </Item>
          <Item
            label='商品价格'
            name='price'
            initialValue={product.price}
            rules={[
              {required:true,message:'商品价格必须输入'},
              {validator:this.validatorPrice}
            ]}
          >
            <Input type='number' placeholder='请输入商品价格' addonAfter="元"/>
          </Item>
          <Item
            label='商品分类'
            name='categoryIds'
            initialValue={categoryIds}
            rules={[
              {required:true,message:'商品分类必须指定'},
            ]}
          >
            <Cascader
              placeholder='请指定商品分类'
              options={optionLists}
              loadData={this.loadData}
              /*onChange={onChange}
              changeOnSelect */
            />
          </Item>
          <Item label='商品图片'>
            <PicturesWall ref={this.pw} imgs={imgs}/>
          </Item>
          <Item label='商品详情' labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
            <RichTextEditor ref={this.editor} detail={detail}/>
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    );
  }
}