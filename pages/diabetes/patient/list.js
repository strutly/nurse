var that;
import Api from '../../../config/api';
import CustomPage from '../../../CustomPage';
CustomPage({
  data: {
    move:false,
    moveIndex:-1,
    patients:[]
  },
  onLoad(options) {
    that = this;
    that.getList(1,'')
  },
  async getList(pageNo,phone){
    let res = await Api.pagePatient({
      pageNo:pageNo,
      phone:phone
    });
    let patients = that.data.patients||[];
    that.setData({
      patients:patients.concat(res.data.content),
      endline:res.data.last,
      pageNo: pageNo,
      phone:phone
    })
  },
  touchstart(e) {    
    that.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    if (Math.abs(angle) > 30) return;
    that.setData({
      move: touchMoveX < startX,
      moveIndex: touchMoveX < startX ? index : -1
    })
  },
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  onReachBottom() {
    let endline = that.data.endline;
    let phone = that.data.phone;
    if(!endline){
      let pageNo = that.data.pageNo + 1;
      that.getList(pageNo,phone);
    }
  },
  submit(e){
    console.log(e);
    let name = e.detail.value.name;
    that.search(name);
    
  },
  search(name){
    that.setData({
      patients:[],
      moveIndex:-1
    })
    that.getList(1,name);
  },
  async delete(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let patients = that.data.patients;
    wx.showModal({
      title:"确认删除此患者?",
      success:async function(res){
        if (res.confirm) {
          console.log(res);
          let res = await Api.deletePatient(e.currentTarget.dataset);
          if(res.code==0){
            patients = patients.filter(p=>{
              return p.id != id;
            })
            that.setData({
              moveIndex:-1,
              patients:patients
            })
            that.showTips("删除成功","success");
          }else{
            that.showTips(res.msg);
          }
          
          
        }
      }
    })
  }
})