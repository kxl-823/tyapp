<template>
  <div class="goods_box">
    <!-- 左侧 -->
    <div id="goods_left" class="left">
      <div>
        <van-sidebar v-model="activeKey">
          <van-sidebar-item
            :title="item.name"
            v-for="(item,index) in goodsArr"
            @click="cheSelect_left(index)"
            :key="item.name"
          />
        </van-sidebar>
      </div>
    </div>

    <!-- 右侧 -->
    <div id="goods_right" class="right">
      <div>
        <div :id="index" v-for="(item,index) in goodsArr" :key="item.name">
          <!-- 表头 -->
          <div class="child_title">{{item.name}}</div>
          <!-- 食物内容 -->

          <div v-for="child in item.foods" :key="child.id" class="showfoods">
            <van-row>
              <van-col span="5">
                <van-image width="60" height="60" :src="child.imgUrl" @click="showInfo(child)" />
              </van-col>

              <van-col span="18" offset="2" class="colText">
                <div class="show_name">{{ child.name }}</div>
                <p>{{child.text}}</p>
                <p class="sellCount">{{child.goodsDesc}}</p>
                <p class="sellCount">
                  月售{{child.sellCount}}份
                  <span>好评率{{child.rating}}%</span>
                </p>
                <!-- 价格加减 -->
                <p class="price">
                  <span class="priceColor">￥{{child.price}}</span>
                  <span class="priceBtn">
                    <!-- 数量大于0 才显示数量和减号 -->
                    <button v-show="child.num>0" class="subBtn" @click="changeNum(-1,child.id)">-</button>
                    <label v-show="child.num>0">{{child.num}}</label>
                    <button class="addBtn" @click="changeNum(1,child.id)">+</button>
                  </span>
                </p>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>

      <!-- 商品详细信息 -->
      <van-overlay :show="show" @click="show = false">
        <div class="wrapper" @click.stop>
          <div class="block" />
          <!-- 图片 -->
          <div class="imgdiv">
            <img :src="info.imgUrl" />
          </div>

          <!-- 中间内容 -->
          <div id="main">
            <div class="infodetail">
              <h4>{{info.name}}</h4>
              <p class="sellCount">
                月售{{info.sellCount}}份
                <span>好评率{{info.rating}}%</span>
              </p>
              <p class="price">
                <span class="priceColor">￥{{info.price}}</span>
                <van-button round type="info" @click="changeNum(1,info.id)" size="small">加入购物车</van-button>
              </p>
            </div>
            <div class="blank"></div>
            <div class="infodetail">
              <h4>商品介绍</h4>
              <p>{{info.goodsDesc}}</p>
            </div>

            <div class="blank"></div>
            <div class="infodetail">
              <p class="btns">
                <van-button color="#00A0DC" @click="showEva(1)">全部{{goodEva.length+badEva.length}}</van-button>
                <van-button color="#CCECF7" @click="showEva(2)">满意{{goodEva.length}}</van-button>
                <van-button color="#EAEBED" @click="showEva(3)">不满意{{badEva.length}}</van-button>
              </p>
              <van-divider />
              <p class="checkicon">
                <van-checkbox v-model="checked" size="26px" @click="check(!flag)">只看有内容的评价</van-checkbox>
              </p>
            </div>

            <!-- 评价 -->
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

          <!-- 底部 -->
          <div class="foot" @click="show=false">
            <span class="carback"></span>
            <img :src="iconsrc" class="iconimg" />
            <span class="gettotal">总计{{gettotal}}</span>
            <button>去结算</button>
          </div>
        </div>
      </van-overlay>

      
    </div>
  </div>
</template>

<script>
//商品数据
//API_SERVE
import { API_GOODS_LIST, API_SERVE, API_SHOP_RATINGS } from "@/api/apis";
import BScroll from "better-scroll";

export default {
  data() {
    return {
      //组件默认样式
      activeKey: 0,
      //在点击时，把当前索引设置为点击的索引
      curIndex: 0,
      show: false,
      info: {},
      checked: false,
      flag: false,
      //评价列表
      evaList: [],
      //好评数组
      goodEva: [],
      //差评数组
      badEva: []
    };
  },
  created() {
    //获取商品信息
    API_GOODS_LIST().then(res => {
      let arr = res.data.goodsList;
      //食品图片
      arr.forEach(element => {
        for (let o of element.foods) {
          o.imgUrl = o.imgUrl.replace("http://127.0.0.1:5000", API_SERVE);
        }
      });

      //增加字段 先增加字段
      for (let obj of arr) {
        for (let food of obj.foods) {
          //默认值
          food.num = 0;
        }
      }
      //再初始化数组
      this.$store.commit("initgoodsArr", arr);

      this.$store.state.goodsArr = arr;
    });
    //
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
  mounted() {
    //给侧边栏设置滚动并且有缓动效果
    new BScroll("#goods_left", {
      click: true //允许点击
    });

    this.Bsright = new BScroll(document.getElementById("goods_right"), {
      //实时监听滚动事件
      probeType: 3,
      click: true //允许点击
    });
    this.Bsright.on("scroll", obj => {
      //obj，滚动的x，y坐标
      var _y = Math.abs(obj.y);
      for (let obj of this.getHeight) {
        //取值区间
        if (_y >= obj.min && _y < obj.max) {
          this.curIndex = obj.index;
          this.activeKey = obj.index;
          break;
        }
      }
    });
  },
  computed: {
    getHeight() {
      //保存div高度数组
      let heightDivArr = [];
      //获取累加高度
      let totalHeight = 0;
      //获取所有的div的高度
      for (let i = 0; i < this.goodsArr.length; i++) {
        let heightDiv = document.getElementById(i).offsetHeight;
        // console.log(heightDiv);
        heightDivArr.push({
          index: i,
          max: totalHeight + heightDiv,
          min: totalHeight
        });
        totalHeight += heightDiv;
      }
      return heightDivArr;
    },
    //拿到商品数组
    goodsArr() {
      return this.$store.state.goodsArr;
    },
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
    //左联动
    cheSelect_left(index) {
      //与当前索引联系起来
      this.curIndex = index;
      // scrollToElement(el, time, offsetX, offsetY, easing)
      // 作用：滚动到指定的目标元素。===》与当前的索引联系起来
      //点击选项卡跳转右侧对应的div
      this.Bsright.scrollToElement(document.getElementById(index), 500);
    },
    //点击当前商品
    changeNum(val, id) {
      this.$store.commit("changegoodnum", { val, id });
    },
    showInfo(info) {
      this.show = true;
      this.info = info;
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
    //点击不同类型获取不同的评价数据列表
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
  }
};
</script>

<style lang="less" scoped>
.goods_box {
  display: flex;
  height: 100%;

  .left {
    width: 80px;
    height: 100%;
    overflow: auto;
    background: #ccc;

    .ispadding {
      padding: 12px 8px;
    }
    .titleAct {
      background-color: #fff;
    }
  }
  .right {
    height: 100%;
    flex: 1;
    overflow: auto;
    .child_title {
      height: 26px;
      line-height: 26px;
      padding: 10px;
      background-color: #eee;
      border-left: 2px solid #ccc;
    }
    .showfoods {
      padding: 10px;

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
    .wrapper {
      display: flex;
      background: #fff;
      line-height: 25px;
      height: 100%;
      flex-direction: column;
      position: relative;
      .imgdiv {
        flex: 1;
        img {
          width: 100%;
          height: 200px;
        }
      }
      #main {
        flex: 2;
        height: 100%;
        overflow: auto;
        position: relative;
        .infodetail {
          padding: 12px;
          .btns {
            padding: 6px;
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
            }
          }
        }
        .blank {
          height: 20px;
          border-top: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
          background: #eee;
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

      //底部
      .foot {
        bottom: 0;
        height: 50px;
        background-color: #3b3b3c;
        width: 100%;
        color: #fff;
        position: relative;
        text-align: center;
        padding: 8px;
        box-sizing: border-box;
        .carback {
          display: block;
          background: #3b3b3c;
          width: 60px;
          height: 60px;
          border-radius: 30px;
          position: absolute;
          top: -16px;
          left: 84px;
        }
        .iconimg {
          position: absolute;
          width: 42px;
          height: 42px;
          top: -9px;
          left: 93px;
        }
        .gettotal {
          position: absolute;
          left: 164px;
          bottom: 12px;
        }
        button {
          background: #f7cb38;
          border: none;
          padding: 3px;
          font-size: 12px;
          width: 60px;
          border-radius: 15px;
          margin-right: 6px;
          position: absolute;
          right: 7px;
          bottom: 9px;
        }
      }
    }
  }
}
</style>