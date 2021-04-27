/*
  包含应用中所有接口请求函数的模块
* */

//登陆
import ajax from "./ajax";
import jsonp from 'jsonp'
import {message} from "antd";

/*export function reqLogin(username,password){
  axios('/login',{username,password},'POST')
}*/
// const BASE = 'http://localhost:5000'
const BASE = ''
export const reqLogin = (username,password) => ajax(BASE+'/login',{username,password},'POST')

export const reqAddUsers = (user) => ajax(BASE+'/manage/user/add',user,'POST')

//获取一级或二级分类列表
export  const reqCategorys = (parentId) => ajax(BASE+'/manage/category/list',{parentId})

//添加分类
export const reqAddCategory = (categoryName,parentId) => ajax(BASE+'/manage/category/add',{categoryName,parentId},'POST')

//更新分类名称
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

//根据分类ID获取一个分类
export const reqCategory = (categoryId) => ajax(BASE+'/manage/category/info',{categoryId})

//获取商品分类列表
export const reqProducts = (pageNum,pageSize) => ajax(BASE+'/manage/product/list',{pageNum,pageSize})

//搜索商品分页列表(根据商品名称/商品描述)
//searchType搜索的类型
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType}) => ajax(BASE+'/manage/product/search',{
  pageNum,
  pageSize,
  [searchType]:searchName,
})

// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

//更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId,status) => ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST')

//添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE+'/manage/product/'+(product._id?'update':'add'),product,'POST')

//获取所有角色的列表
export const reqRoles = () => ajax(BASE+'/manage/role/list')

//添加角色
export const reqAddRole = (roleName) => ajax(BASE+'/manage/role/add',{roleName},'POST')

//更新角色(给角色设置权限)
export const reqUpdateRole = (role) => ajax(BASE+'/manage/role/update',role,'POST')

//获取所有用户
export const reqUsers = () => ajax(BASE+'/manage/user/list')

//删除用户
export const reqDeleteUser = (userId) => ajax(BASE+'/manage/user/delete',{userId},'POST')

//添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE+'/manage/user/'+(user._id?'update':'add'),user,'POST')

/*jsonp请求*/
export const reqWeather = (cityId) => {

  return new Promise((resolve,reject)=>{
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${cityId}&key=a5cefcc87c2578d8fabb11f859ae544e`
    jsonp(url,{},(err,data)=>{
      if(!err && data.status*1 === 1){
        // console.log('成功了',data)
        const {weather} = data.lives[0]
        resolve(weather)
      }else {
        message.error('获取天气信息失败')
      }
    })
  })
}

// reqWeather(110101)