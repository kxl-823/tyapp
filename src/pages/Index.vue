<template>
  <div id="box">
    <div id="indexBox" v-show="isloading">
      <div class="header">
        <div class="bg_blur">
          <van-row gutter="20" class="header_padding">
            <van-col span="6">
              <van-image width="80" height="80" :src="sellList.avatar" />
            </van-col>

            <van-col span="16" style="padding-left:20px">
              <h4 class="brand_box">
                <img src="../assets/fonts/brand@2x.png" width="38rem" height="26rem" />
                {{sellList.name}}
              </h4>
              <p class="fontSizes">{{sellList.description}}/{{sellList.deliveryTime}}分钟送达</p>
              <p class="fontSizes">
                <img src="../assets/fonts/decrease_1@2x.png" width="20rem" height="18rem" />
                在线支付满28减5,满50减10
              </p>
            </van-col>

            <van-col span="4" class="btn_box">
              <van-button class="btn_info" @click="show = true" text="5个>" />
              <!-- 弹出框 -->
              <van-overlay :show="show" @click="show = false">
                <div class="wrapper" @click.stop>
                  <div class="block" />
                  <h3>{{sellList.name}}</h3>
                  <p>
                    <van-rate v-model="sellList.score" />
                  </p>
                  <van-divider style="color:#fff">
                    <h4>优惠信息</h4>
                  </van-divider>
                  <div class="supportstext" v-for="(item,index) in supportsList" :key="index">
                    <img :src="item.src" />
                    {{item.title}}
                  </div>
                  <van-divider style="color:#fff">
                    <h4>商家公告</h4>
                  </van-divider>
                  <div class="bulletin">{{sellList.bulletin}}</div>

                  <div class="close" @click="show=false">×</div>
                </div>
              </van-overlay>
            </van-col>
          </van-row>
        </div>
      </div>

      <div class="main">
        <div></div>
        <div class="info_box">
          <van-notice-bar
            class="info_bar"
            left-icon="volume-o"
            text="在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"
          />
        </div>
        <!-- 导航条 -->
        <div class="tabList">
          <van-row type="flex" justify="space-around">
            <van-col
              span="6"
              v-for="(item,index) in tabList"
              :key="index"
              :class="{cur:item.hashtext==activeName}"
            >
              <router-link :to="item.hashtext">{{item.title}}</router-link>
            </van-col>
          </van-row>
        </div>

        <div class="index_view">
          <!-- 加载三个页面视口 -->
          <router-view></router-view>
        </div>
      </div>

      <!-- 底部购物车 -->
      <!-- 显示向上滑动 -->
      <transition name="slide-fade">
        <div v-show="showcar" class="shop-board">
          <ShopCar></ShopCar>
        </div>
      </transition>
      <div class="foot" @click="showCar">
        <div class="info">
          <p>
            <img src="@/assets/imgs/kefu.png" alt />
          </p>
          <p>联系商家</p>
        </div>
        <span class="carback"></span>
        <img :src="iconsrc" class="iconimg" />
        <span class="gettotal">总计{{gettotal}}</span>
        <button>去结算</button>
      </div>
    </div>
    <!-- 进入页面默认加载的占位图片 -->
    <img v-show="!isloading" class="pic" src="@/assets/imgs/bg.png" alt />
  </div>
</template>

<script>
//API_SHOP_SELLER 商家数据
//API_SERVE 默认地址
import { API_SHOP_SELLER, API_SERVE } from "@/api/apis";
import ShopCar from "../pages/ShopCar";
export default {
  data() {
    return {
      sellList: {},
      //占位图
      isloading: false,
      //导航
      tabList: [
        { title: "商品", hashtext: "/" },
        { title: "评价", hashtext: "/evaluate" },
        { title: "商家", hashtext: "/merchant" }
      ],
      //加载默认的样式，
      activeName: "/",
      //购物车面板
      showcar: false,
      //弹出框
      show: false,
      //活动数组
      supportsList: [
        {
          src: require("../assets/fonts/decrease_3@2x.png"),
          title: "在线支付满28减5，满50减10"
        },
        {
          src: require("../assets/fonts/discount_3@2x.png"),
          title: "单人精彩赛"
        },
        {
          src: require("../assets/fonts/discount_3@2x.png"),
          title: "清肺雪梨汤8折抢购"
        },
        {
          src: require("../assets/fonts/special_3@2x.png"),
          title: "特价饮品8折购"
        },
        {
          src: require("../assets/fonts/special_3@2x.png"),
          title: "单人特色套餐"
        }
      ]
    };
  },
  components: {
    ShopCar
  },
  created() {
    //获取商家信息

    API_SHOP_SELLER().then(res => {
      //显示占位
      this.isloading = true;
      this.sellList = res.data.data;
      let obj = res.data.data;
      //头像
      obj.avatar = obj.avatar.replace("http://127.0.0.1:5000", API_SERVE);
      this.sellList = obj;
      this.sellList.supports = this.sellList.supports.toString();
      this.sellList.date = this.sellList.date.join("-").toString();
    });
  },
  //监听hash的变化
  watch: {
    $route(to) {
      this.activeName = to.path;
    }
  },
  computed: {
    //拿到商品数组
    iconsrc() {
      if (this.$store.getters.shopcar.length > 0) {
        return require("@/assets/imgs/car_bright.png");
      }
      return require("@/assets/imgs/car.png");
    },
    //计算总价
    gettotal() {
      let total = 0;
      for (let obj of this.$store.getters.shopcar) {
        total += obj.num * obj.price;
      }
      return total.toFixed(2);
    }
  },
  methods: {
    //点击购物车板,length<0就不显示
    showCar() {
      if (this.$store.getters.shopcar.length > 0) {
        this.showcar = this.showcar == true ? false : true;
      } else {
        this.showcar = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
}
#box {
  height: 100%;
  position: relative;
  .pic {
    width: 100%;
  }
  #indexBox {
    height: 100%;
    display: flex;
    flex-direction: column;
    //头部
    .header {
      height: 135px;
      display: flex;
      flex-direction: column;
      position: relative;
      .bg_blur {
        width: 100%;
        &:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent url("../assets/imgs/4.jpg") center center
            no-repeat;
          filter: blur(8px);
          z-index: -1;
          background-size: cover;
        }
      }
      .header_padding {
        position: absolute;
        display: flex;
        justify-content: space-between;
        top: 0;
        flex: 1.5;
        padding: 18px;
        color: #fff;
        .brand_box {
          img {
            vertical-align: middle;
          }
        }
        .fontSizes {
          font-size: 14px;
          img {
            vertical-align: middle;
          }
        }
        .btn_box {
          position: relative;
          color: #fff;
          .btn_info {
            background: #eee;
            opacity: 0.5;
            position: absolute;
            bottom: 16px;
            width: 70px;
            border-radius: 20px;
            padding: 10px;
          }
          .wrapper {
            padding: 40px;
            text-align: center;
            line-height: 24px;
            .supportstext {
              text-align: left;
              img {
                width: 22px;
                height: 22px;
                vertical-align: -4px;
              }
            }
            .bulletin {
              text-align: left;
            }
            .close {
              font-size: 60px;
              color: #ccc;
              margin-top: 60px;
            }
          }
        }
      }
    }
    //主体
    .main {
      flex: 4;
      height: 100%;
      overflow-y: scroll;
      display: flex;
      flex-direction: column;
      //公告
      .info_box {
        background: #888;
        opacity: 0.5;
        .info_bar {
          color: #fff;
          background: none;
          img {
            vertical-align: middle;
          }
        }
      }
      .index_box {
        display: flex;
        justify-content: space-around;
        line-height: 40px;
        border-bottom: 1px solid #eee;
        a {
          text-decoration: none;
        }
      }
      .tabList {
        line-height: 36px;
        text-align: center;
        border-bottom: 1px solid #eee;
        .cur {
          a {
            border-bottom: 2px solid #ee0a24;
            width: 36px;
            display: inline-block;
            height: 36px;
          }
        }
      }
      .index_view {
        height: 100%;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
      }
    }
    //购物车面板
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
      transition: all 0.8s ease;
    }
    .slide-fade-leave-active {
      transition: all 0.8s ease;
    }
    .slide-fade-enter,
    .slide-fade-leave-to {
      transform: translateY(10px);
      opacity: 0;
    }
    //底部
    .foot {
      bottom: 0px;
      background-color: #3b3b3c;
      width: 100%;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      .info {
        display: flex;
        flex-direction: column;
        text-align: center;
        margin-left: 6px;
        p {
          color: #f7cb38;
          font-size: 14px;
          img {
            width: 30px;
          }
        }
      }
      .carback {
        display: block;
        background: #3b3b3c;
        width: 60px;
        height: 60px;
        border-radius: 30px;
        position: absolute;
        top: -16px;
        left: 80px;
      }
      .iconimg {
        position: absolute;
        width:42px;
        height:42px;
        top: -9px;
        left: 89px;
      }
      button {
        background: #f7cb38;
        border: none;
        padding: 8px;
        border-radius: 15px;
        margin-right: 6px;
      }
    }
  }
}
</style>  