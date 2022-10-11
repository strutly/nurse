const log = require('./log');
const fileManager = wx.getFileSystemManager();
const urls = {
  //百度ocr
  apiKey: 'nmnQtFnFSKDpbwgHBRxHQuFq',
  secKey: 'YGLIat4wkPhyuxywkVsBc8vEjUKOnjij',
  baiduTokenUrl: "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id={apiKey}&client_secret={secKey}",

  parseResultUrl:"https://this.tsing-care.com/rest/medical-parse/?n=h301"
}
const pathParams = function (url, params = {}) {
  Object.keys(params).map(function (key) {
    let re = '{' + key + '}';
    url = url.replace(re, params[key]);
  });
  return url;
};
// 获取百度access_token  
var getBaiduToken = async function () {
  let baiduToken = wx.getStorageSync('baiduToken');
  console.log(baiduToken);
  if (baiduToken && baiduToken.access_token && baiduToken.expireTime && baiduToken.expireTime > new Date().getTime()) {
    return baiduToken.access_token;
  }
  console.log("getToken")
  return new Promise(function (resolve, reject) {
    wx.request({
      url: pathParams(urls.baiduTokenUrl, {
        apiKey: urls.apiKey,
        secKey: urls.secKey
      }),
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/json; charset-UTF-8'
      },
      success: function (res) {
        console.log("[BaiduToken获取成功]", res);
        if (res.statusCode == 200) {
          let token = res.data;
          token.expireTime = new Date().getTime() + 2590000;
          wx.setStorageSync('baiduToken', token);
          resolve(token.access_token);
        } else {
          resolve("");
        }
      },
      fail: function (res) {
        console.log("[BaiduToken获取失败]", res);
        resolve("")
      }
    })
  });
};

const getParseResult = function(ocr_words){
  return new Promise(function (resolve, reject) {
    wx.request({
      url: urls.parseResultUrl,
      data: {
        content: ocr_words
      },
      method: 'POST',
      dataType: 'json',
      header: {
        "token":"6nUP7aZ3iAG_K7e"       
      },
      success: async function (res) {
        log.info("解析结果为:",res.data);
        resolve(res.data)
      },
      fail: function (res) {
        log.info("解析错误结果为:",res);
        console.log('get word fail：', res);
        resolve({});
      }
    })
  });
}

const BaiduOcr = function (imgData, detectUrl) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: detectUrl,
      data: {
        image: imgData
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'// 必须的        
      },
      success: function (res) {
        console.log(res.data);
        log.info("图片识别结果为:", res.data);
        let words_result = res.data.words_result;
        resolve(words_result);
      },
      fail: function (res) {
        log.info("图片识别失败结果为:", res.data);
        console.log('get word fail：', res.data);
        resolve({});
      }
    })
  });
};
const getOcrResult = async function (imgs) {
  
  let result = "";
  log.info("进入图片识别:", JSON.stringify(imgs))
  wx.showLoading({
    title: '图片识别中~',
  })
  try {
    let token = await getBaiduToken();
    const detectUrl = `https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=${token}`;
    for (let i = 0; i < imgs.length; i++) {
      let file = imgs[i];
      let quality = 100;
      /**
       * 大于4M的照片 压缩至3.6M
       */
      if (file.size > 4 * 1024 * 1024) {
        quality = ((4 * 1024 * 1024) / file.size) * 90;
        let newFile = await wx.compressImage({//压缩图片
          src: file.tempFilePath, // 图片路径
          quality: quality
        });
        file = newFile;
      }
      let base64 = 'data:image/jpg;base64,' + fileManager.readFileSync(file.tempFilePath, 'base64');
      let words_result = await BaiduOcr(base64, detectUrl);
      words_result.forEach(word => {
        result += word.words;
      })
    }
    let obj = await getParseResult(result);
    if(obj.code==0){
      result = obj.data;
    }
    console.log(obj)
  } catch (error) {
    log.error("图片识别过程出错", JSON.stringify(error));
  }
  wx.hideLoading({
    success: (res) => {
      wx.showToast({
        title: '识别结束~',
        icon: 'none'
      })
    },
  })
  return result;
}
let ocr = {
  getOcrResult: (data) => getOcrResult(data)
}
module.exports = ocr;