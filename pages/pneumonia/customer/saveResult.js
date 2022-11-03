
var that;
const app = getApp();
import Api from '../../../config/api';
import CustomPage from '../../../CustomPage';
import WxValidate from "../../../utils/WxValidate";
CustomPage({
  data: {
    tips: '请患者使用微信扫描下方二维码，关注公众号并绑定个人信息',
    coughQuestions:[{
      title: "近两周来，咳嗽会让您胸痛或肚子痛吗?",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您会因咳嗽有痰而烦恼吗?",
      checks: ['每次都会', '多数时间会', '不时会', '有时会', '偶尔会', '极少会', '从来不会']
    }, {
      title: "近两周来，咳嗽会让您感到疲倦吗?",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您觉得能控制咳嗽吗?",
      checks: ['一点也不能', '几乎不能', '很少能', '有时能', '常常能', '多数时间能', '一直都能']
    }, {
      title: "近两周来，咳嗽会让您觉得尴尬吗?",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会让您焦虑不安吗?",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会影响您的工作或其他日常事务吗?",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会影响您的整个娱乐生活吗?",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，接触油漆油烟会让您咳嗽吗?",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会影响您的睡眠吗?",
      checks: ['一直都会', '大多数时间会', '常常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您每天阵发性咳嗽发作多吗?",
      checks: ['持续有', '次数多', '时时有', '有一些', '偶尔有', '极少有', '一点也没有']
    }, {
      title: "近两周来，您会因咳嗽而情绪低落吗?",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会让您厌烦吗?",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会让您声音嘶哑吗?",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您会觉得精力充沛吗?",
      checks: ['一点也不会 ', '几乎不会', '很少会', '有时会', '常常会', '多数时间会', '一直都会']
    }, {
      title: "近两周来，咳嗽会让您担心有可能得了重病吗?",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会让您担心别人觉得您身体不对劲吗?",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您会因咳嗽中断谈话或接听电话吗?",
      checks: ['每次都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您会觉得咳嗽惹恼了同伴?家人或朋友?",
      checks: ['每次都会', '多数时间会 ', '不时会 ', '有时会', '偶尔会', '极少会', '从来不会']
    }],
    disabled: false,
    
    doctorArr:[]
  },

  async onLoad(options) {
    that = this;
    that.initValidate();
    let res = await Api.doctorPage({
      type:1
    });
    that.setData({
      doctorArr:res.data
    })
    console.log(res);
  },
  initValidate() {
    let rules = {
      phone: {
        required: true,
        tel:true
      },
      height: {
        required: true
      },
      weight: {
        required: true
      },
      doctorId: {
        required: true
      }
    }, messages = {
      phone: {
        required: "请输入正确的手机号",
        tel:"请输入正确的手机号"
      },
      height: {
        required: "请输入身高"
      },
      weight: {
        required: "请输入体重"
      },
      doctorId: {
        required: "请选择经管医生"
      }
    };
    that.WxValidate = new WxValidate(rules, messages);
  },
  pickerChange(e) {
    console.log(e);
    that.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
  },
  otherChange(e) {
    let name = e.currentTarget.dataset.name;
    that.setData({
      [name]: e.detail.value
    })
  },
  async submit(e) {
    console.log(e);
    
    let data = e.detail.value;
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0]
      that.showTips(error.msg)
      return false;
    }


    that.setData({
      disabled: true
    })
    let patientData = app.globalData.patientData;
    patientData = Object.assign(patientData, data);
    Object.keys(patientData).map(key => {
      console.log(key)
      if (key.indexOf(".") > -1) {
        let s = key.split(".");
        if (!patientData[s[0]]) patientData[s[0]] = {};
        patientData[s[0]][s[1]] = patientData[key];
        delete patientData[key];
      }
    })
    patientData.scanData = app.globalData.scanData;

    console.log(patientData);
    let res = await Api.addPatient(patientData);
    console.log(res);
    if (res.code == 0) {
      that.setData({
        codeUrl: res.data.url,
        patientId: res.data.id,
        tips: res.data.url ? '请患者使用微信扫描下方二维码，关注公众号并绑定个人信息' : '二维码生成失败,点击重新生成二维码',
        show: true
      })
    } else {
      that.showTips(res.msg);
    }
  },
  async updateCode() {
    let res = await Api.codePatient({ id: that.data.patientId });
    if (res.code == 0) {
      that.setData({
        tips: '请患者使用微信扫描下方二维码，关注公众号并绑定个人信息',
        codeUrl: res.data
      })
    }
  }
})