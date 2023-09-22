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
    pageNum:['','',''],
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
    
    that.showLine(res.data.sugarBeforLine);
    that.getList(0,1);
  },

  showLine(lineData) {
    console.log(lineData)

    var windowWidth = 320;
    if(!lineData.days || lineData.days.length<=0){
      that.setData({
        chartLine:false
      })
      return that.showToast("暂无此类数据");
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
        name: '餐前血糖',
        data: lineData.values,
        format: function (val, name) {
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
    let type = e.currentTarget.dataset.type;
    let tabIndex = that.data.tabIndex;
    if (index == tabIndex) return;
    let statisticsData = that.data.statisticsData;
    let lineData = statisticsData[type];

    let showChartLine = !lineData.days || lineData.days.length<=0;
    that.setData({
      chartLine:!showChartLine,
      tabIndex:index
    })
    if(showChartLine) return that.showToast("暂无此类数据");      
    
    let nameArr = ['餐前血糖','餐后血糖','收缩压','舒张压'];
    lineChart.updateData({
      categories: lineData.days,
      series: [{
        name: nameArr[index],
        data: lineData.values,
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
        pageNum:pageNo,
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
        pageNum:pageNo,
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