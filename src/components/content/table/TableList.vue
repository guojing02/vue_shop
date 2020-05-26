<template>
  <div>
    <el-table :data="isDataList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column :label="labels[0]||orderLabel[0]" :prop="props[0] || orderprop[0]"></el-table-column>
      <el-table-column
        :label="labels[1]||orderLabel[1]"
        :prop="props[1] || orderprop[1]"
        width="95px"
      ></el-table-column>
      <!-- 是否付款 -->
       <el-table-column v-if="isCreateTime" :label="labels[2]||orderLabel[2]"
        :prop="props[2] || orderprop[2]" width="95px">
        <template v-slot='scope'>
          <el-tag type='success' v-if="scope.row.pay_status === '1'">已付款</el-tag>
          <el-tag type='danger' v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-else
        :label="labels[2]||orderLabel[2]"
        :prop="props[2] || orderprop[2]"
        width="95px"
      ></el-table-column>

      <!-- 商品列表 -->
      <el-table-column v-if="isAddTime" :label="labels[3]" width="150px">
        <template v-slot="scope">{{scope.row.add_time | dateFormat}}</template>
      </el-table-column>
      <el-table-column
        v-else
        :label="labels[3]||orderLabel[3]"
        :prop="props[3] || orderprop[3]"
        width="150px"
      ></el-table-column>

      <!-- 订单 -->
      <el-table-column v-if="isCreateTime" :label="orderLabel[4]" width="150px">
        <template v-slot="scope">{{scope.row.create_time | dateFormat}}</template>
      </el-table-column>
      <el-table-column
        v-else
        :label="labels[4]||orderLabel[4]"
        :prop="props[4] || orderprop[4]"
        width="95px"
      ></el-table-column>

      <!-- 操作按钮区 -->
      <el-table-column v-if="isAddTime" :label="labels[5]||orderLabel[5]" width="300px">
        <template v-slot="scope">
          <table-slot :goods_id="scope.row.goods_id">
            <span slot="center"></span>
            <span slot="four"></span>
          </table-slot>
        </template>
      </el-table-column>
       <el-table-column v-else :label="labels[5]||orderLabel[5]" width="300px">
        <template v-slot="scope">
          <table-slot :goods_id="scope.row.order_id">
            <span slot="center"></span>
            <span slot="right"></span>
          </table-slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import tableSlot from "./tableSlot";

export default {
  name: "TableList",
  components: {
    tableSlot
  },
  data() {
    return {};
  },
  props: {
    orderLists: {
      type: Array,
      default: () => []
    },
    orderLabel: {
      type: Array,
      default: () => []
    },
    orderprop: {
      type: Array,
      default: () => []
    },
    goodsList: {
      type: Array,
      default: () => []
    },
    labels: {
      type: Array,
      default: () => []
    },
    props: {
      type: Array,
      default: () => []
    }
  },
  methods: {},
  created() {},
  computed: {
    isAddTime() {
      if (this.goodsList.length !== 0) {
        return true;
      } else {
        return false;
      }
    },
    isCreateTime() {
      if (this.orderLists.length !== 0) {
        return true;
      } else {
        return false;
      }
    },
    isDataList() {
      if (this.goodsList.length !== 0) {
        return this.goodsList;
      } else {
        return this.orderLists;
        // console.log(this.orderLists);
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>