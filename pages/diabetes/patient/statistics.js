var that, lineChart;
import Api from '../../../config/api';
import CustomPage from '../../../CustomPage';
import wxCharts from "../../../utils/wxChart";
CustomPage({

  data: {
    tabIndex:0,
    footIndex:0,
    footTab:['随访记录','日报告','量表'],
    lists:[[],[],[]],
    endline:[false,false,false],
    pageNo:['','',''],
    chartLine:true
  },

  async onLoad(options) {
    that = this;
    let res = await Api.patientStatistics({
      id: options.id
    })

    that.setData({
      statisticsData: res.data
    })
    console.log(res);
    
    that.showLine(res.data.sugarLine);
    that.getList(0,1);
  },

  showLine(lineData) {
    console.log(lineData)
    console.log(1)
    var windowWidth = 320;
    if(lineData.days.length<=0){
      that.setData({
        chartLine:false
      })
      return;
    }
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
      return that.toast("折线图生成失败");
    }
    lineChart = new wxCharts({
      canvasId: 'myChart',
      type: 'line',
      categories: lineData.days,
      animation: true,
      series: [{
        name: '餐前',
        data: lineData.values1,
        format: function (val, name) {
          console.log(val)
          return val + '';
        }
      }, {
        name: '餐后',
        data: lineData.values2,
        format: function (val, name) {
          console.log(val)
          return val + '';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '数值',
        format: function (val) {
          return val;
        }
      },
      width: windowWidth,
      height: 300,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  updateLine(series) {
    lineChart.updateData({
      series: series
    })
  },
  tabChange(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let tabIndex = that.data.tabIndex;
    if (index == tabIndex) return;
    let statisticsData = that.data.statisticsData;
    let lineData;
    if (index == 0) {
      lineData = statisticsData.sugarLine;
    } else {
      lineData = statisticsData.pressureLine;
    }
    that.setData({
      tabIndex:index
    })
    lineChart.updateData({
      series: [{
        name: index == 0 ? '餐前' : '舒张压',
        data: lineData.values1,
        format: function (val, name) {
          console.log(val)
          return val + '';
        }
      }, {
        name: index == 0 ? '餐后' : '收缩压',
        data: lineData.values2,
        format: function (val, name) {
          console.log(val)
          return val + '';
        }
      }]
    });
  },
  async getList(index,pageNo){
    let param = {};
    var data,res;
    
    if(index==0){
      param = {
        pid:that.data.options.id
      };
      res = await Api.allFollow(param);
      that.setData({
        ['endline['+index+']']:true
      })
      
      data = res.data;
    }else if(index==1){
      param = {
        type:1,
        pageNo:pageNo,
        patientId:that.data.options.id
      }
      res = await Api.pageReport(param);
      data = res.data.content; 
      that.setData({
        ['endline['+index+']']:res.data.last
      })      
    }else{
      param = {
        type:2,
        pageNo:pageNo,
        patientId:that.data.options.id
      }
      res = await Api.pageReport(param);
      data = res.data.content;
      that.setData({
        ['endline['+index+']']:res.data.last
      })     
    }    
    
    let lists = that.data.lists;
    lists[index] = lists[index].concat(data)
    that.setData({
      lists:lists,
      ['pageNo['+index+']']: pageNo
    })
    console.log(res);
  },
  onReachBottom() {
    let endline = that.data.endline;
    let footIndex = that.data.footIndex;
    if(!endline[footIndex]){
      let pageNo = that.data.pageNo[footIndex] + 1;
      that.getList(footIndex,pageNo);
    }
  },
  footTab(e){
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let footIndex = that.data.footIndex;
    let pageNo = that.data.pageNo;
    if (index == footIndex) return;
    that.setData({
      footIndex:index
    })
    if(!pageNo[index]){
      that.getList(index,1);
    }
  },
  open(e){
    console.log(e);
    let open = that.data.open;
    let index = e.currentTarget.dataset.index;
    if(open!=index){
      that.setData({
        open:index
      })
    }else{
      that.setData({
        open:-1
      })
    }    
  },

})