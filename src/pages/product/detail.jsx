import React, {Component} from 'react'
import {
  Card,
  List,
} from 'antd'

import {ArrowLeftOutlined} from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import {reqCategory} from '../../api/index'
import {BASE_IMG_URL} from '../../utils/constants'

const Item = List.Item

/*是product的详情路由组件*/
export default class ProductDetail extends Component {

  state = {
    cName1:'',
    cName2:'',
  }

  async componentDidMount() {
    const {pCategoryId,categoryId} = this.props.location.state.product
    if(pCategoryId==='0'){//说明是一级分类下的商品
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    }else {
      /*
      //通过多个await方式发送请求，后面一个请求是在前一个请求成功返回之后再发送
      const result1 = await reqCategory(pCategoryId)
      const result2 = await reqCategory(categoryId)
      const cName1 = result1.data.name
      const cName2 = result2.data.name
      */

      //一次性发送多个请求。只有都成功了，才正常处理
      const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      this.setState({cName1,cName2})
    }
  }

  render() {
    const {name,price,detail,imgs} = this.props.location.state.product
    // console.log(name,desc,price,detail)
    const {cName1,cName2} = this.state
    const title = (
      <span>
        <LinkButton>
          <ArrowLeftOutlined
            style={{color:'green',marginRight:10}}
            onClick={()=>this.props.history.goBack()}
          />
        </LinkButton>
        <span>商品详情</span>
      </span>
    )

    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item className='product-detail-item'>
            <span className='left'>商品名称：</span>
            <span className='right'>{name}</span>
          </Item>
          <Item className='product-detail-item'>
            <span className='left'>商品价格：</span>
            <span className='right'>{price}</span>
          </Item>
          <Item className='product-detail-item'>
            <span className='left'>所属分类：</span>
            <span className='right'>{cName1} {cName2?' --> '+cName2:''}</span>
          </Item>
          <Item className='product-detail-item'>
            <span className='left'>商品图片：</span>
            <span className='right'>
              {
                imgs.map(img => {
                  return (
                    <img key={img} className='product-img' src={BASE_IMG_URL+img} alt="img"/>
                  )
                })
              }
            </span>
          </Item>
          <Item className='product-detail-item'>
            <span className='left'>商品详情：</span>
            <span className='right' dangerouslySetInnerHTML={{__html:detail}}>
            </span>
          </Item>
        </List>
      </Card>
    )
  }
}