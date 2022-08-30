var that;
const app = getApp()
import WxValidate from "../../utils/WxValidate";
import CustomPage from "../../CustomPage";
CustomPage({
  data: {
    images: [],
    diagnoses:[],
    treats:[{
      name:"利格列汀片(上海勃林格) ",
      specs:"5mg(1片) ",
      way:"口服",
      time:'1/早'
    },{
      name:"盐酸二甲双胍片(施贵宝)  ",
      specs:"5g(1片) ",
      way:"口服3/日",
      time:'三餐前'
    },{
      name:"双环醇片(北京协和)  ",
      specs:"5mg(1片) ",
      way:"口服3/日",
      time:''
    }]
  },
  onLoad(options) {
    that = this;
    that.setData({
      scanData: app.globalData.scanData
    })
    that.initValidate();
  },
  initValidate() {
    let rules = {
      name: {
        required: true
      },
      phone: {
        required: true,
        tel: true
      },
      age: {
        required: true
      },
      gender: {
        required: true
      },
      weight: {
        required: true
      },
      height: {
        required: true
      }
    }, messages = {
      name: {
        required: "请输入姓名"
      },
      phone: {
        required: "请输入手机号码",
        tel: "请输入正确的手机号"
      },
      age: {
        required: "请输入年龄"
      },
      gender: {
        required: "请输入性别"
      },
      weight: {
        required: "请输入体重"
      },
      height: {
        required: "请输入身高"
      }
    };
    that.WxValidate = new WxValidate(rules, messages);
  },
  async scan(){
    try {
      let res = await wx.chooseMedia({
        count:1,
        mediaType:["image"]      
      });
      console.log(res);
      let base64 = 'data:image/jpg;base64,' + fileManager.readFileSync(res.tempFiles[0].tempFilePath,'base64')
      let data = await Api.scanImageInfo(base64);
      console.log(data);
      that.setData({
        scanData:data
      });
    } catch (error) {
      console.log(error);
      that.showTips("图片识别失败");
    }    
  },
  chooseImage() {
    let images = that.data.images;
    wx.chooseMedia({
      count: 4 - images.length,
      mediaType: ['image'],
      sizeType: ['compressed'],
      success(res) {
        console.log(res);
        let tempFiles = res.tempFiles;
        for (let file of tempFiles) {
          console.log(file)
          images.push(file.tempFilePath);
        }
        that.setData({
          images: images
        })

      }
    })
  },
  delImg(e) {
    console.log(e);
    let images = that.data.images;
    images.splice(e.currentTarget.dataset.index, 1);
    console.log(images)
    that.setData({
      images: images
    })
  },
  saveResult() {
    wx.navigateTo({
      url: '/pages/patient/saveResult',
    })
  },
  add(e){
    console.log(e);
    let type = e.currentTarget.dataset.type;
    console.log(type);
    let vals = that.data[type+"s"];
    console.log(vals);
    vals.push({});
    that.setData({
      [type+"s"]:vals
    })
  },
  remove(e){
    console.log(e);
    let type = e.currentTarget.dataset.type;
    console.log(type);
    let vals = that.data[type+"s"];    
    vals.splice(e.currentTarget.dataset.index, 1);
    console.log(vals)
    that.setData({
      [type+"s"]:vals
    })
  },
  inputChange(e){
    let type = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.title;
    let vals = that.data[type+"s"];
    let val = vals[index];
    val[name] = e.detail.value;
    that.setData({
      [type+"s"]:vals
    })
  },
  submit(e){
    let data = e.detail.value;
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0]
      that.showTips(error.msg)
      return false;
    }
    app.globalData.patientData = data;
    app.globalData.scanData = data;
    wx.navigateTo({
      url: '/pages/patient/saveResult',
    })

     
  }

})