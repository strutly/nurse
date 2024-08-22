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
  getList(pageNo,name){
    Api.pagePatient({
      pageNum:pageNo,
      name:name,
      pageSize:15,
      diseaseId:that.data.options.diseaseId
    }).then(res=>{
      let patients = that.data.patients||[];
      that.setData({
        patients:patients.concat(res.data.content),
        endline:res.data.last,
        pageNo: pageNo,
        name:name
      })
    },err=>{
      that.showTips(err.msg);
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
    let name = that.data.name;
    if(!endline){
      let pageNo = that.data.pageNo + 1;
      that.getList(pageNo,name);
    }
  },
  submit(e){
    console.log(e);
    let name = e.detail.value;
    that.search(name);    
  },
  search(name){
    that.setData({
      patients:[],
      moveIndex:-1
    })
    that.getList(1,name);
  },
  delete(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let patients = that.data.patients;
    wx.showModal({
      title:"确认删除此患者?",
      success:function(res){
        if (res.confirm) {
          Api.deletePatient(e.currentTarget.dataset).then(res=>{
            patients = patients.filter(p=>{
              return p.id != id;
            })
            that.setData({
              moveIndex:-1,
              patients:patients
            })
            that.showTips("删除成功","success");
          },err=>{
            that.showTips(err.msg);
          })
        }
      }
    })
  },
  unhook(e){
    let id = e.currentTarget.dataset.id;
    that.setData({
      modalunhook:true,
      unhookId:id
    })
  },
  submitUnhook(e){
    let data = e.detail.value;
    if(!data.unhookReason){
      return that.showTips("请输入脱落原因再提交")
    }
    let patients = that.data.patients;
    Api.patientUnhook(data).then(res=>{      
      console.log(res);
      that.showTips("操作成功","success");
      let index = patients.findIndex(p=>p.id==data.id);
      console.log(index);
      patients.splice(index,1);
      that.setData({
        patients:patients,
        modalunhook:false,
        unhookId:'',
        moveIndex:-1
      })
    },err=>{
      that.showTips(err.msg);
    })
  }
})