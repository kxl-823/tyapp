import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

//创建一个store(仓库)，保存需要传递的交互数据
var store=new Vuex.Store({
    //state:存放所有交互数据
    state:{
        //商品数组
        goodsArr:[]
    },
    //mutations:改变，他是改变state值的唯一方式
    mutations:{
       //初始化数组
       initgoodsArr(state,arr){
            state.goodsArr=arr
       },
        //改变商品数量 通过id获取对应的商品
        changegoodnum(state,obj){
            //循环 
            for(let paramas of state.goodsArr){
                for(let food of paramas.foods){
                    if(food.id==obj.id){
                        //对应的商品
                        food.num += obj.val
                        return
                    }
                }
                
            }
            
        },
        clearShop(state){
            for(let paramas of state.goodsArr){
                for(let food of paramas.foods){
                    if(food.num > 0){
                        //对应的商品
                        food.num = 0
                    }
                }
                
            }
        }
    },
    //vuex中的计算属性，和computed效果类似
    getters:{
        //获取内购物车的数据
        shopcar(state){
            let arr=[]
            for(let obj of state.goodsArr){
                for(let food of obj.foods){
                    if(food.num>0){
                        //追加到数组中
                        arr.push(food)
                    }
                }
            }
            return arr
            
        }
    }
})
//vuex中的计算属性  getter
//console.log(store.getters.getname);
//触发一个改变的函数(mutations)
// store.commit('函数名')
//暴露出去
export default store