<template>
  <div class="merchant_box">
    <div class="score_box">
      <van-row>
        <van-col span="14" offset="1">
          <h3>{{sellList.name}}</h3>
          <p>
            <van-rate v-model="sellList.score" allow-half />月售
            <span>{{sellList.sellCount}}</span>单
          </p>
        </van-col>
        <van-col span="4" offset="4" class="like_box">
          <van-icon name="like" color="#ee0a24" size="26" />
          <p>已收藏</p>
        </van-col>
      </van-row>
      <van-divider />

      <van-row type="flex" justify="space-around">
        <van-col span="6" class="val_col">
          <p>起送价</p>
          <span>{{sellList.minPrice}}</span>元
        </van-col>
        <van-col span="6" class="val_col">
          <p>商家配送</p>
          <span>{{sellList.deliveryPrice}}</span>元
        </van-col>
        <van-col span="6" class="val_text">
          <p>平均配送时间</p>
          <span>{{sellList.deliveryTime}}</span>分钟
        </van-col>
      </van-row>
    </div>
    <div class="blank"></div>
    <div class="shopAcount">
      <h3>公告与活动</h3>
      <p class="acountInfo">{{sellList.bulletin}}</p>
      <div class="acount_prompt" v-for="(item,index) in list" :key="index">
        <img :src="item.src" alt />
        {{item.title}}
      </div>
    </div>
    <div class="blank"></div>
    <div class="sellview">
      <h3>商家实景</h3>
      <van-swipe :loop="false" :width="550">
        <van-swipe-item v-for="(item,index) in sellList.pics" :key="index">
          <img :src="item" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <div class="blank"></div>
    <div class="sellInfo">
      <h3>商家信息</h3>
      <div>
        <p class="acount_prompt">商家支持开发票，请下单时填好发票抬头</p>
        <p class="acount_prompt">品类：{{sellList.supports}}</p>
        <p class="acount_prompt">地址：四川省成都市高新区，天府新谷xxx号</p>
        <p class="acount_prompt">营业时间：{{sellList.date}}</p>
      </div>
    </div>
  </div>
</template>

<script>
//API_SHOP_SELLER 商家数据
//API_SERVE 默认ip
import { API_SHOP_SELLER,API_SERVE } from "@/api/apis";
export default {
  data() {
    return {
      value: 4.5,
      value1: 1,
      list: [
        {
          src: require("../../assets/fonts/decrease_3@2x.png"),
          title: "在线支付满28减5，满50减10"
        },
        {
          src: require("../../assets/fonts/discount_3@2x.png"),
          title: "单人精彩赛"
        },
        {
          src: require("../../assets/fonts/discount_3@2x.png"),
          title: "清肺雪梨汤8折抢购"
        },
        {
          src: require("../../assets/fonts/special_3@2x.png"),
          title: "特价饮品8折购"
        },
        {
          src: require("../../assets/fonts/special_3@2x.png"),
          title: "单人特色套餐"
        },
        {
          src: require("../../assets/fonts/invoice_3@2x.png"),
          title: "商家支持开发票，请下单时填好发票抬头"
        },
        {
          src: require("../../assets/fonts/guarantee_3@2x.png"),
          title: "已加入“外卖保”计划，食品安全保障 "
        }
      ],
      //商家数据
      sellList: {},

    };
  },
  created() {
     //获取商家信息
      API_SHOP_SELLER().then(res => {
        let obj=res.data.data;
        
        //店铺实景
        obj.pics=obj.pics.map(element=>{
          return element.replace('http://127.0.0.1:5000',API_SERVE)
        })
        this.sellList = obj;
        this.sellList.supports = this.sellList.supports.toString();
        //this.sellList.date = this.sellList.date.join("-").toString().substring(11);
        this.sellList.date = this.sellList.date.join("-").toString()
      });
      
  },
  computed:{
    name(){
      return this.$store.state.name
    }
  },
 
};
</script>

<style lang="less" scoped>
.merchant_box {
  .score_box {
    padding: 10px;
      .van-rate {
        vertical-align: -3px;
      }
    .like_box {
      text-align: center;
    }
    .val_col {
      border-right: 1px solid #eee;
      p {
        font-size: 14px;
        color: #888;
      }
      span {
        font-size: 32px;
      }
    }
    .val_text {
      p {
        font-size: 14px;
        color: #888;
      }
      span {
        font-size: 32px;
      }
    }
  }
  .blank {
    height: 20px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    background: #eee;
  }
  .shopAcount {
    padding: 10px;
    .acountInfo {
      color: #ee0a24;
      text-indent: 8px;
      line-height: 26px;
      margin: 8px 0;
    }
    .acount_prompt {
      border-top: 1px solid #ccc;
      line-height: 48px;
      img {
        vertical-align: middle;
      }
    }
  }
  .sellview {
    padding: 10px;
  }
  .sellInfo {
    padding: 10px;
    .acount_prompt {
      border-top: 1px solid #ccc;
      line-height: 40px;
    }
  }
}
</style>