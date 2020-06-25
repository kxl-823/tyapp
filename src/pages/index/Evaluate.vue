<template>
  <div class="eva_box">
    <van-row type="flex" justify="space-around" class="grade">
      <van-col span="8" class="val_col">
        <p>{{sellList.score}}</p>
        <h4>综合评分</h4>
        <span>高于周边商家62.9%</span>
      </van-col>
      <van-col span="14" class="valcol">
        <p>
          服务态度&emsp;&emsp;
          <van-rate v-model="sellList.score" allow-half />
          <span>{{sellList.score}}</span>
        </p>
        <p>
          服务态度&emsp;&emsp;
          <van-rate v-model="sellList.score" allow-half />
          <span>{{sellList.score}}</span>
        </p>
        <p>送达时间&emsp;&emsp; {{sellList.deliveryTime}}分钟</p>
      </van-col>
    </van-row>
    <div class="blank"></div>
    <div class="btns">
      <p>
        <van-button color="#00A0DC" @click="showEva(1)">全部{{goodEva.length+badEva.length}}</van-button>
        <van-button color="#CCECF7" @click="showEva(2)">满意{{goodEva.length}}</van-button>
        <van-button color="#EAEBED" @click="showEva(3)">不满意{{badEva.length}}</van-button>
      </p>

      <van-divider />
      <p class="checkicon">
        <van-checkbox v-model="checked" size="26px" @click="check(!flag)">只看有内容的评价</van-checkbox>
      </p>
    </div>
    <van-divider />

    <div class="eva_info" v-for="(item,index) in evaList" :key="index">
      <div v-show="item.show">
        <div class="top">
          <van-row type="flex" justify="space-between">
            <van-col span="2">
              <van-image round width="3rem" height="3rem" fit="fill" :src="item.avatar" />
            </van-col>
            <van-col span="11">
              <p>{{item.username}}</p>
              <p>
                <van-rate
                  v-model="item.score"
                  void-icon="star"
                  color="#FE9900"
                  void-color="#eee"
                  size="16px"
                />
                <span class="star_text" v-show="item.deliveryTime">{{item.deliveryTime}}分钟送达</span>
              </p>
            </van-col>

            <van-col span="8" class="timer">{{dateFormat(item.rateTime)}}</van-col>
          </van-row>
        </div>
        <div class="middle">
          <van-row type="flex">
            <van-col span="3"></van-col>
            <van-col>{{item.text}}</van-col>
          </van-row>
        </div>
        <div class="bottom">
          <van-row type="flex">
            <van-col span="3"></van-col>
            <van-col>
              <img v-if="!item.rateType" src="@/assets/imgs/good.png" width="18px" />
              <img v-else src="@/assets/imgs/poor.png" width="18px" />
              <van-tag plain v-for="(item,index) in item.recommend" :key="index">
                <p>{{item}}</p>
              </van-tag>
            </van-col>
          </van-row>
        </div>
      </div>

      <van-divider />
    </div>
  </div>
</template>

<script>
//API_SHOP_SELLER 商家数据
//API_SHOP_RATINGS 评价数据
import { API_SHOP_SELLER, API_SHOP_RATINGS } from "@/api/apis";
export default {
  data() {
    return {
      checked: false,
      flag: false,
      //商家数据
      sellList: {},
      //评价列表
      evaList: [],
      list: [],
      loading: true,
      //好评数组
      goodEva: [],
      //差评数组
      badEva: []
    };
  },
  methods: {
    //获取商家信息
    seller() {
      API_SHOP_SELLER().then(res => {
        this.sellList = res.data.data;
      });
    },
    //点击切换有无内容数据
    check(flag) {
      this.flag = flag;
      if (flag) {
        this.list = this.evaList; //保存有评价和无评价数组
        let newArr = []; //有评价数组
        this.evaList.forEach(element => {
          if (element.text) {
            newArr.push(element);
          }
        });
        this.evaList = newArr;
      } else {
        this.evaList = this.list;
      }
    },
    //评价
    eva() {
      API_SHOP_RATINGS().then(res => {
        //console.log(res);
        this.evaList = res.data.data;
        this.evaList.forEach(element => {
          element.show = true;
          this.$set(element, "show", true);
          //好评差评
          if (!element.rateType) {
            this.goodEva.push(element);
          } else {
            this.badEva.push(element);
          }
        });
      });
    },
    //点击不同类型获取不同的数据列表
    showEva(type) {
      if (type == 1) {
        this.evaList = this.goodEva.concat(this.badEva);
      } else if (type == 2) {
        this.evaList = this.goodEva;
      } else {
        this.evaList = this.badEva;
      }
    },
    //转换时间格式
    dateFormat(dateForm) {
      if (dateForm === "") {
        //解决deteForm为空传1970-01-01 00:00:00
        return "";
      } else {
        var dateee = new Date(dateForm).toJSON();
        var date = new Date(+new Date(dateee) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, " ")
          .replace(/\.[\d]{3}Z/, "");
        return date;
      }
    }
  },
  created() {
    this.seller();
    this.eva();
  },
  mounted() {
    this.loading = false;
  }
};
</script>

<style lang="less" scoped>
.eva_box {
  .grade {
    padding: 10px;
    .val_col {
      border-right: 1px solid #eee;
      text-align: center;
      line-height: 30px;
      p {
        font-size: 28px;
        color: #ff9807;
      }
      span {
        font-size: 12px;
        color: #888;
      }
    }
    .valcol {
      line-height: 30px;
      .van-rate {
        vertical-align: -4px;
      }
      span {
        color: #ff9807;
      }
    }
  }
  .blank {
    height: 20px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    background: #eee;
  }
  .btns {
    padding: 15px;
    p {
      line-height: 22px;
      .van-button {
        margin-right: 10px;
      }
    }
    .checkicon {
      color: #999;
      .van-icon {
        vertical-align: middle;
      }
    }
  }
  .eva_info {
    padding: 14px;
    .top {
      .van-rate {
        vertical-align: -1px;
      }
      .timer {
        font-size: 12px;
        color: #888;
      }
      .star_text {
        font-size: 14px;
      }
    }
    .bottom {
      margin-top: 6px;
      .van-icon {
        vertical-align: -4px;
      }
      .van-tag {
        margin: 0 4px;
        p {
          width: 45px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>