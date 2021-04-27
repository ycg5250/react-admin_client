import React, {Component} from 'react';
import PropTypes from 'prop-types'

import {Upload, Modal, message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import {reqDeleteImg} from '../../api'
import {BASE_IMG_URL} from "../../utils/constants";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/*用于图片上传的组件*/
export default class PicturesWall extends Component {

  static propTypes = {
    imgs:PropTypes.array
  }

  state = {
    previewVisible: false, //标识是否显示大图预览Modal
    previewImage: '', //大图的url
    previewTitle: '',
    fileList: [
      /*{
        uid: '-1',  //每个file都有自己的唯一的id
        name: 'image.png', //图片名字
        status: 'done', //图片状态：done已上传，uploading：正在上传，removed：已删除，error：上传错误
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },*/
    ],
  };

  constructor(props) {
    super(props);
    let fileList =[]
    const {imgs} = this.props
    if(imgs && imgs.length>0){
      fileList = imgs.map((img,index)=>({
        uid: -index,  //每个file都有自己的唯一的id
        name: img, //图片名字
        status: 'done', //图片状态：done已上传，uploading：正在上传，removed：已删除，error：上传错误
        url: BASE_IMG_URL + img
      }))
    }
    //初始化状态
    this.state = {
      previewVisible: false, //标识是否显示大图预览Modal
      previewImage: '', //大图的url
      previewTitle: '',
      fileList   // 所有已上传图片的数组
    }
  }

  //获取所有已上传图片文件名字的数组
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  //隐藏Modal
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    // console.log(file)
    //显示指定file对应的大图
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  /*
  file：当前操作的图片文件(山上传/删除)
  fileList：所有已上传图片文件对象的数组
  * */
  handleChange = async ({ file,fileList }) => {
    console.log('handleChange()',file)
    //一旦上传成功，将当前上传的file的信息修正(name,url)
    if(file.status==='done'){
      const result = file.response //{status: 0,data: {name: 'xxx.jpg',url: '图片地址'}}
      if(result.status===0){
        const {name,url} = result.data
        file = fileList[fileList.length-1]
        file.name = name
        file.url = url
        message.success('图片上传成功！')
      }else {
        message.error('图片上传失败！')
      }
    }else if(file.status==='removed'){
      const result = await reqDeleteImg(file.name)
      if(result.status===0){
        message.success('删除图片成功')
      }else {
        message.error('删除图片失败')
      }
    }
    //在操作(上传/删除)过程中更新fileList状态
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action="/manage/img/upload" /*上传图片的接口地址*/
          accept='image/*'  /*只接收图片格式*/
          name='image'  /*请求参数名*/
          listType="picture-card" /*卡片样式*/
          fileList={fileList} /*所有已上传图片文件对象的数组*/
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}