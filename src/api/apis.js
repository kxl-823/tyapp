import axios from 'axios'
//设置服务器的默认地址
 export const API_SERVE = 'http://192.168.43.28:5000'
 //export const API_SERVE = 'http://127.0.0.1:5000'
axios.defaults.baseURL = API_SERVE

//获取商家接口
export const API_SHOP_SELLER = () => axios.get('/shop/seller');
//评价数据
export const API_SHOP_RATINGS = () => axios.get('/shop/ratings');
//商品数据
export const API_GOODS_LIST = () => axios.get('/goods/goods_list');