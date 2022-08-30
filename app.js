import Api from './config/api';
App({
  onLaunch() {
    Api.login().then(res=>{
      console.log(res);
    })
  },
  globalData: {
    userInfo: null,
    scanData:{}
  }
})
