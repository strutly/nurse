var that;
import Api from '../../../config/api';
import CustomPage from '../../../CustomPage';
import WxValidate from '../../../utils/WxValidate';
CustomPage({
  data: {
    coughQuestions: [{
      title: "近两周来，咳嗽会让您胸痛或肚子痛吗?",
      type: "psychic",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您会因咳嗽有痰而烦恼吗?",
      type: "psychic",
      checks: ['每次都会', '多数时间会', '不时会', '有时会', '偶尔会', '极少会', '从来不会']
    }, {
      title: "近两周来，咳嗽会让您感到疲倦吗?",
      type: "psychic",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您觉得能控制咳嗽吗?",
      type: "mand",
      checks: ['一点也不能', '几乎不能', '很少能', '有时能', '常常能', '多数时间能', '一直都能']
    }, {
      title: "近两周来，咳嗽会让您觉得尴尬吗?",
      type: "mand",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会让您焦虑不安吗?",
      type: "mand",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会影响您的工作或其他日常事务吗?",
      type: "society",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会影响您的整个娱乐生活吗?",
      type: "society",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，接触油漆油烟会让您咳嗽吗?",
      type: "psychic",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会影响您的睡眠吗?",
      type: "psychic",
      checks: ['一直都会', '大多数时间会', '常常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您每天阵发性咳嗽发作多吗?",
      type: "psychic",
      checks: ['持续有', '次数多', '时时有', '有一些', '偶尔有', '极少有', '一点也没有']
    }, {
      title: "近两周来，您会因咳嗽而情绪低落吗?",
      type: "mand",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会让您厌烦吗?",
      type: "mand",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会让您声音嘶哑吗?",
      type: "psychic",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您会觉得精力充沛吗?",
      type: "psychic",
      checks: ['一点也不会 ', '几乎不会', '很少会', '有时会', '常常会', '多数时间会', '一直都会']
    }, {
      title: "近两周来，咳嗽会让您担心有可能得了重病吗?",
      type: "mand",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会让您担心别人觉得您身体不对劲吗?",
      type: "mand",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您会因咳嗽中断谈话或接听电话吗?",
      type: "society",
      checks: ['每次都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您会觉得咳嗽惹恼了同伴?家人或朋友?",
      type: "society",
      checks: ['每次都会', '多数时间会 ', '不时会 ', '有时会', '偶尔会', '极少会', '从来不会']
    }]
  },
  async onLoad(options) {
    that = this;
    console.log(options)
    let res = await Api.detailReport(options);
    console.log(res);
    let treats = JSON.parse(res.data.report.content.treats || '[]');
    that.setData({
      reportForm: res.data.report,
      treats: treats,
      patient: res.data.patient
    })
    that.initValidate();
  },
  initValidate() {
    let rules = {
      'content.sugarBefore': {
        required: true
      },
      'content.sugarAfter': {
        required: true
      },
      'content.diastolicPressure': {
        required: true
      },
      'content.systolicPressure': {
        required: true
      },
    }, messages = {
      'content.sugarBefore': {
        required: '请输入餐前血糖'
      },
      'content.sugarAfter': {
        required: '请输入餐后血糖'
      },
      'content.diastolicPressure': {
        required: '请输入收缩压'
      },
      'content.systolicPressure': {
        required: '请输入舒张压'
      }
    };
    that.WxValidate = new WxValidate(rules, messages);
  },
  checkboxChange(e) {
    console.log(e);
    that.setData({
      ['reportForm.content.' + e.currentTarget.dataset.type]: e.detail.value[0] || 0
    })
  },
  async addImg(e) {
    console.log(e);
    let type = e.currentTarget.dataset.type;

    let imgRes = await wx.chooseMedia({
      sourceType: ['album'],
      mediaType: ['image'],
      count: 1
    });
    console.log(imgRes)
    let res = await Api.uploadFile(imgRes.tempFiles[0].tempFilePath, true);
    that.setData({
      ['reportForm.content.' + type]: res.data
    })
  },
  removeImg(e) {
    let type = e.currentTarget.dataset.type;
    that.setData({
      ['reportForm.content.' + type]: ''
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
  async submit(e) {
    console.log(e);
    let data = e.detail.value;
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0]
      that.showTips(error.msg)
      return false;
    }

    Object.keys(data).map(key => {
      console.log(key)
      if (key.indexOf(".") > -1) {
        let s = key.split(".");
        if (!data[s[0]]) data[s[0]] = {};
        data[s[0]][s[1]] = data[key];
        delete data[key];
      }
    })
    console.log(data);
    data.content.treats = JSON.stringify(that.data.treats);
    let res = await Api.updateReport(data);
    console.log(res);
    if (res.code == 0) {
      that.showTips('修改成功', 'success')
    } else {
      that.showTips(res.msg);
    }

  }

})