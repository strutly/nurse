var that;
const app = getApp()
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
CustomPage({

  data: {
    typeArr:['1型','2型','未知'],
    follows:[],
    open:-1
  },
  onLoad(options) {
    that = this;
  },
  async onShow(){    
    that.getList();
    that.getInfo();
  },
  async getInfo(){
    let res = await Api.detailPatient({
      id:that.data.options.id
    });
    that.setData({      
      patient:res.data.patient
    })
  },
  async getList(){
    let res = await Api.allFollow({
      pid:that.data.options.id
    });
    that.setData({
      follows:res.data
    })
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
  async submit(e) {
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
    if (res.code == 0) {      
      that.setData({
        modalfollow: false
      })
      that.getList();
    } else {
      that.showTips(res.msg);
    }
  },  
})