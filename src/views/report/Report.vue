<template>
  <div>
    <dreadcrumb>
      <span slot="tow">数据统计</span>
      <span slot="three">数据报表</span>
    </dreadcrumb>
    <el-card>
       <div id="main" style="width: 1500px;height:600px;"></div>
    </el-card>
  </div>
</template>

<script>
import Dreadcrumb from '../../components/content/breadcrumb/Dreadcrumb'
import echarts from 'echarts'

import {deepClone} from '../../common/clone'
import {itemIfMixin} from '../../common/mixin'
export default {
  components:{
    Dreadcrumb
  },
  mixins:[itemIfMixin],
  async mounted(){
     var myChart = echarts.init(document.getElementById('main'))
     const {data:res} = await this.$http.get(`reports/type/1`)
     this.get200(res,'获取折线图数据失败','获取折线图数据成功')
      const result = deepClone(res.data,this.options)
      myChart.setOption(result);
  },
  data(){
    return{
      options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
    }
  },
  methods:{

  }
}
</script>

<style lang="less" scoped>

</style>