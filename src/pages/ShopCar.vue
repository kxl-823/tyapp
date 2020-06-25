<template>
  <div id="shocarHeight">
    <div class="top">
      <div class="carTitle">在线支付满28减5，满50减10"</div>
      <div class="carfoods">
        <span>美食已装入口袋</span>
        <span @click="delfoods">
          <img src="../assets/imgs/del.png" alt />清空购物车
        </span>
      </div>
    </div>

    <div class="showfoods">
      <van-row v-for="item in shopcarList" :key="item.id">
        <van-col span="5">
          <van-image width="60" height="60" :src="item.imgUrl" />
        </van-col>
        <van-col span="18" offset="2" class="colText">
          <div class="show_name">{{ item.name }}</div>
          <p>{{item.text}}</p>
          <p class="sellCount">{{item.goodsDesc}}</p>
          <p class="sellCount">
            月售{{item.sellCount}}份
            <span>好评率{{item.rating}}%</span>
          </p>
          <!-- 价格加减 -->
          <p class="price">
            <span class="priceColor">￥{{item.price}}</span>
            <span class="priceBtn">
              <!-- 数量大于0 才显示数量和减号 -->
              <button v-show="item.num>0" class="subBtn" @click="changeNum(-1,item.id)">-</button>
              <label v-show="item.num>0">{{item.num}}</label>
              <button class="addBtn" @click="changeNum(1,item.id)">+</button>
            </span>
          </p>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    //从vuex中获取购物车的数据
    shopcarList() {
      return this.$store.getters.shopcar;
    }
  },
  methods: {
    //点击当前商品
    changeNum(val, id) {
      this.$store.commit("changegoodnum", { val, id });
    },
    //清空内容
    delfoods() {
      if (this.$store.getters.shopcar.length > 0) {
        this.$store.commit("clearShop");
      }
    }
  }
};
</script>

<style lang="less" scoped>
#shocarHeight {
  max-height: 200px;
  display: flex;
  flex-direction: column;
  .top {
    flex: 1;
    top: 0;
    .carTitle {
      text-align: center;
      background: #f7cb38;
      color: #f60;
      line-height: 30px;
      font-size: 14px;
    }
    .carfoods {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      line-height: 20px;
      img {
        vertical-align: -3px;
        width: 14px;
      }
    }
  }

  .showfoods {
    flex: 2;
    padding: 10px;
    height: 100%;
    overflow: auto;
    .van-row {
      padding: 8px;
    }
    .show_name {
      font-size: 14px;
      font-weight: bold;
    }
    .sellCount {
      font-size: 12px;
      color: #888;
    }
    .price {
      display: flex;
      justify-content: space-between;
      .priceColor {
        color: red;
        font-weight: bold;
      }
      .priceBtn {
        button {
          width: 22px;
          height: 22px;
          margin: 0 4px;
          border-radius: 50%;
          border: none;
          background: #fff;
          &.subBtn {
            border: 2px solid #fbc500;
            color: #fbc500;
          }
          &.addBtn {
            background: #fbc500;
            color: #ffffff;
          }
        }
      }
    }
    .colText {
      margin-left: 10px;
    }
  }
}
</style>