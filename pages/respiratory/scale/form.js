var that;
import WxValidate from "../../../utils/WxValidate";
import CustomPage from '../../../CustomPage';
CustomPage({

  data: {
    coughQuestions:[{
      title: "近两周来，咳嗽会让您胸痛或肚子痛吗?",
      type:"psychic",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您会因咳嗽有痰而烦恼吗?",
      type:"psychic",
      checks: ['每次都会', '多数时间会', '不时会', '有时会', '偶尔会', '极少会', '从来不会']
    }, {
      title: "近两周来，咳嗽会让您感到疲倦吗?",
      type:"psychic",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您觉得能控制咳嗽吗?",
      type:"mand",
      checks: ['一点也不能', '几乎不能', '很少能', '有时能', '常常能', '多数时间能', '一直都能']
    }, {
      title: "近两周来，咳嗽会让您觉得尴尬吗?",
      type:"mand",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会让您焦虑不安吗?",
      type:"mand",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会影响您的工作或其他日常事务吗?",
      type:"society",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会影响您的整个娱乐生活吗?",
      type:"society",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，接触油漆油烟会让您咳嗽吗?",
      type:"psychic",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会影响您的睡眠吗?",
      type:"psychic",
      checks: ['一直都会', '大多数时间会', '常常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您每天阵发性咳嗽发作多吗?",
      type:"psychic",
      checks: ['持续有', '次数多', '时时有', '有一些', '偶尔有', '极少有', '一点也没有']
    }, {
      title: "近两周来，您会因咳嗽而情绪低落吗?",
      type:"mand",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会让您厌烦吗?",
      type:"mand",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会让您声音嘶哑吗?",
      type:"psychic",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您会觉得精力充沛吗?",
      type:"psychic",
      checks: ['一点也不会 ', '几乎不会', '很少会', '有时会', '常常会', '多数时间会', '一直都会']
    }, {
      title: "近两周来，咳嗽会让您担心有可能得了重病吗?",
      type:"mand",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，咳嗽会让您担心别人觉得您身体不对劲吗?",
      type:"mand",
      checks: ['一直都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您会因咳嗽中断谈话或接听电话吗?",
      type:"society",
      checks: ['每次都会', '大多数时间会', '时常会', '有时会', '很少会', '几乎不会', '一点也不会']
    }, {
      title: "近两周来，您会觉得咳嗽惹恼了同伴?家人或朋友?",
      type:"society",
      checks: ['每次都会', '多数时间会 ', '不时会 ', '有时会', '偶尔会', '极少会', '从来不会']
    }],
    score:[],
    max:11,
    sum:-1
  },

  onLoad(options) {
    that = this;
    that.initValidate(-1);
  },
  initValidate(num) {
    
    let rules = {},messages = {};

    if(num>0){
      let questions = that.data.coughQuestions;
      questions.forEach((question,i)=>{
        rules[i]={
          required: true
        };
        messages[i]={
          required: "请选择[ "+question.title+" ]的答案"
        };
      })
    }
    
    that.WxValidate = new WxValidate(rules, messages);
  },

  chooseScore(e){
    console.log(e);
    that.setData(e.currentTarget.dataset);
    that.initValidate(that.data.sum);
  },
  choose(e){
    let dataset = e.currentTarget.dataset;
    let score = that.data.score;
    score[dataset['q']] = {score:dataset['score'],type:dataset['type']};
    that.setData({
      score:score
    })
  },
  getResult(data){
    console.log(data);
    let sum = 0;
    let map = {};
    data.forEach(score=>{
      if(!map[score.type]){
        map[score.type] = [];
      }
      map[score.type].push(score);
    })

    Object.values(map).forEach(values=>{
      let temp = 0;
      values.forEach(val=>{
        temp+= val.score;
      })
      sum+=Math.floor((temp/values.length)*100)/100;
    })
    return sum;
  },
  submit(e){
    console.log(e);
    let data = e.detail.value;
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0]
      that.showTips(error.msg)
      return false;
    }
    let score = that.data.score;
    console.log(data);
    console.log(that.getResult(that.data.score));
    var pages = getCurrentPages();
    var previousPage = pages[pages.length - 2]; //上一个页面
    previousPage.setData({
      [that.data.options.type]: {sum:that.getResult(score),result:score}
    })
    wx.navigateBack({
      delta: 1
    })
  }
  
})