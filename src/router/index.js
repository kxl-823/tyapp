import Vue from 'vue'
import VueRouter from 'vue-router'
import Goods from '../pages/index/Goods'



//与vue联系起来
Vue.use(VueRouter)


const router= new VueRouter({
    routes:[
        {
            //商品页面
            path:'/',
            name:'goods',
            component:Goods
        },
        {
            //评价
            path:'/evaluate',
            name:'evaluate',
            component:()=> import ('../pages/index/Evaluate')
        },
        {
            //商家
            path:'/merchant',
            name:'merchant',
            component:()=> import ('../pages/index/Merchant')
        },
    ]
})

export default router