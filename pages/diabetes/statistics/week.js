var that, ringChart;
import Api from '../../../config/api';
import CustomPage from '../../../CustomPage';
import wxCharts from "../../../utils/wxChart";
CustomPage({

  data: {
    statistic:{
      patientNum:1,
      followNum:0,
      reportNum:0,
      formNum:0,
      undones:[]
    },
    showIndex:-1
  },

  onLoad(options) {
    that = this;
  },
  onReady() {
    console.log("onReady")
    getApp().watch(function (value) {
      console.log(value);
      /*
        登录成功,并且授权成功 ,获取首页数据
      */
      if (value.login && value.auth) {
        that.showData()
      }

    })
  },

  async showData(){
    let res = await Api.patientWeekStatistics();
    console.log(res);

    if(res.code==0){
      that.setData({
        statistic:res.data
      })
  
      ringChart = new wxCharts({
        canvasId: 'myChart',
        type: 'ring',
        extra:{
          pie:{offsetAngle:-90}
        },
        title :{
          fontSize :30,
          name :parseInt((res.data.hasDoNum*100)/(res.data.patientNum*9))+"%"
        },
        series: [{
          name: '已完成',
          data: res.data.hasDoNum,
        },{
          name: '未完成',
          color :'#eee',
          data: res.data.unDoNum,
        }],
        width: 400,
        height: 350,
        dataLabel: false
      });
    }else{
      that.showTips(res.msg)
    }

    
  },
  showDes(e){
    console.log(e);
    that.setData({
      showIndex:e.currentTarget.dataset.index
    })
    setTimeout(()=>{
      that.setData({
        showIndex:-1
      })
    },3000)
  }
})