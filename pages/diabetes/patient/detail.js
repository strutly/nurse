var that;
import Api from '../../../config/api';
import CustomPage from '../../../CustomPage';
CustomPage({
  data: {
    typeArr:['1型','2型','未知'],
  },
  onLoad(options) {
    console.log(options)
    that = this;    
  },
  async onShow(){
    let res = await Api.detailPatient({
      id:that.data.options.id
    });
    console.log(res);
    that.setData({
      patient:res.data.patient,
      nums:res.data.nums
    })
  },
  showModal(){
    that.setData({
      show:!that.data.show
    })
  },
  async submit(e){
    console.log(e);    
    let data = e.detail.value;
    Object.keys(data).map(key => {
      console.log(key)
      if (key.indexOf(".") > -1) {
        let s = key.split(".");
        if (!data[s[0]]) data[s[0]] = {};
        data[s[0]][s[1]] = data[key];
        delete data[key];
      }
    })
    let res = await Api.addFollow(data);
    console.log(res);
    if(res.code==0){
      that.setData({
        show:false
      })
    }else{
      that.showTips(res.msg);
    }
  },
  async notice(e){
    console.log(e)
    let data = e.detail.value;
    if(!data.advice) return that.showTips("请输入通知内容~");
    let res = await Api.addReport({type:4,patientId:data.patientId,content:{advice:data.advice}});
    if(res.code==0){
      let nums = that.data.nums;
      nums['4-1'] = (nums['4-1']||0)+1;
      that.setData({
        modalnotice:false,
        nums:nums
      })
    }else{
      that.showTips(res.msg);
    }


  }
})