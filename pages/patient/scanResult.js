var that;
const app = getApp()
import WxValidate from "../../utils/WxValidate";
import CustomPage from "../../CustomPage";
import Api from "../../config/api";
const fileManager = wx.getFileSystemManager();
CustomPage({
  data: {
    images: [],
    diagnoses: [],
    treats: [{
      name: "利格列汀片(上海勃林格) ",
      specs: "5mg(1片) ",
      way: "口服",
      time: '1/早'
    }, {
      name: "盐酸二甲双胍片(施贵宝)  ",
      specs: "5g(1片) ",
      way: "口服3/日",
      time: '三餐前'
    }, {
      name: "双环醇片(北京协和)  ",
      specs: "5mg(1片) ",
      way: "口服3/日",
      time: ''
    }]
  },
  onLoad(options) {
    that = this;
    console.log(app.globalData.scanData)
    let dis = app.globalData.scanData['出院诊断'].split(";") || [];
    console.log(dis.map(item => {
      console.log(item);
      return { name: item }
    }))
    that.setData({
      scanData: app.globalData.scanData,
      diagnoses: dis.map(item => {
        console.log(item);
        return { name: item }
      })
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
  async scan() {
    try {
      let res = await wx.chooseMedia({
        count: 9,
        sourceType: ['album'],
        mediaType: ["image"]
      });
      console.log(res);
      let datas = "";
      try {
        for (let i = 0; i < res.tempFiles.length; i++) {
          let file = res.tempFiles[i];
          let quality = 100;
          console.log(file.size)
          console.log(file.size > 6 * 1024 * 1024)
          if (file.size > 4 * 1024 * 1024) {//大于10兆压缩50%
            console.log(22)
            quality = ((4 * 1024 * 1024) / file.size) * 90;
            let newFile = await wx.compressImage({//压缩图片
              src: file.tempFilePath, // 图片路径
              quality: quality
            });
            console.log(newFile)
            file = newFile;
            console.log(file)
          }
          let base64 = 'data:image/jpg;base64,' + fileManager.readFileSync(file.tempFilePath, 'base64')

          let data = await Api.scanImageInfo(base64);
          datas += data;
        }
        console.log(datas);
        let sacaResult = Api.scanResult(datas);
        app.globalData.scanData = sacaResult;

        wx.showToast({
          title: '图片识别成功',
          icon: 'none'
        })
        that.setData({
          scanData: sacaResult
        })
      } catch (error) {
        wx.showToast({
          title: '图片识别成功',
          icon: 'none'
        })
      }
    } catch (error) {
      console.log(error)
    }
  },

  async chooseImage() {
    let images = that.data.images;
    try {
      let res = await wx.chooseMedia({
        count: 4 - images.length,
        mediaType: ['image'],
        sizeType: ['compressed']
      });
      console.log(res)
      for (let file of res.tempFiles) {
        that.uploadImage(file.tempFilePath);
      }
    } catch (error) {
      console.log(error);
      return that.showTips('您已经取消上传', 'info');
    }
  },
  async uploadImage(filePath) {
    let images = that.data.images;
    let res = await Api.uploadFile(filePath, true)
    if (res.code == 0) {
      images.push(res.data);
      that.setData({
        images: images
      })
    } else {
      that.showTips(res.msg);
    }
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
  add(e) {
    console.log(e);
    let type = e.currentTarget.dataset.type;
    console.log(type);
    let vals = that.data[type + "s"];
    console.log(vals);
    vals.push({});
    that.setData({
      [type + "s"]: vals
    })
  },
  remove(e) {
    console.log(e);
    let type = e.currentTarget.dataset.type;
    console.log(type);
    let vals = that.data[type + "s"];
    vals.splice(e.currentTarget.dataset.index, 1);
    console.log(vals)
    that.setData({
      [type + "s"]: vals
    })
  },
  inputChange(e) {
    let type = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.title;
    let vals = that.data[type + "s"];
    let val = vals[index];
    val[name] = e.detail.value;
    that.setData({
      [type + "s"]: vals
    })
  },
  submit(e) {
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