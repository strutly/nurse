var that;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
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
})