var that;
import Api from '../../../config/api';
import CustomPage from '../../../CustomPage';
CustomPage({
  data: {
    info:{},
    typeArr: ['2型', '1型'],
    sourceArr:['手工填写','艾糖CGM','瞬感CGM'],
    allline:{},
  },
  async onLoad(options) {
    console.log(options)
    that = this;
  },
  onShow(){
    Api.detailPatient({
      id:that.data.options.id
    }).then(res=>{
      that.setData({
        info:res.data.patient,
        nums:res.data.nums
      });
    },err=>{
      that.showTips(err.msg);
    })
  },  
  showAll(e){
    console.log(e);
    let type = e.currentTarget.dataset.type;
    let allline = that.data.allline;
    allline[type] = !allline[type];
    that.setData({
      allline:allline
    })
  },
  pickerChange(e){
    console.log(e);
    let name = e.currentTarget.dataset.name;
    let info = that.data.info;
    info[name] = e.detail.value;
    that.setData({
      info:info
    })   
  },
  assessChange(e){
    console.log(e);
    let name = e.currentTarget.dataset.name;
    let info = that.data.info;
    info.assess[name] = e.detail.value;
    that.setData({
      info:info
    })   
  },
  edit(e){
    console.log(e);
    let dataset = e.currentTarget.dataset;
    let patientData = that.data.info;
    dataset['data'] = patientData.scanData[dataset['name']];
    that.setData({
      modaledit:true,
      editData:dataset
    })
  },
  addEdit(){
    let editData = that.data.editData;
    editData.data.push("");
    that.setData({
      editData:editData
    })
  },
  editRemove(e){
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let editData = that.data.editData;
    editData.data.splice(index, 1);
    that.setData({
      editData: editData
    })
  },
  editEnd(e){
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    let editData = that.data.editData;
    if(type=='list'){
      editData['data'][index] = e.detail.value;
    }else{
      editData['data'] = e.detail.value;
    }
    that.setData({
      editData:editData
    })
  },
  save(e){
    console.log(e);
    let name = e.currentTarget.dataset.name;
    let editData = that.data.editData;
    let data = editData.data;
    let type = e.currentTarget.dataset.type;
    if(type=='list'){
      data = data.filter(item=>item.trim().length>0);
    }    
    console.log(data);
    let patientData = that.data.info;
    patientData.scanData[name] = data;
    that.setData({
      modaledit:false,
      info:patientData
    })
  },
  submit(e){
    let info = that.data.info;
    Api.updatePatient(JSON.stringify(info)).then(res=>{
      console.log(res);
      that.showTips("保存成功","success");
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    },err=>{
      console.log(err);
    })
  }
})