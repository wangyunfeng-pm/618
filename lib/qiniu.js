
var qiniu = require("qiniu");

var config = {
  ak: 'fHBUpVf7zkwOlGKTnuAV3sZHDhhrD86n5uBuGK0H',
  sk: 'GrwbQId27AJtWi306CqIlLXOvitcATIL5XFbUXlB',
  bucket: 'caicloudui'
};

var upload = function(filePath, fileName, fn){

  //需要填写你的 Access Key 和 Secret Key
  qiniu.conf.ACCESS_KEY = config.ak;
  qiniu.conf.SECRET_KEY = config.sk;
  //要上传的空间
  var bucket = config.bucket;

  //上传到七牛后保存的文件名
  var key = fileName;

  //构建上传策略函数
  function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
    return putPolicy.token();
  }
  //生成上传 Token
  token = uptoken(bucket, key);
  //要上传文件的本地路径
  var filePath = filePath;
  //构造上传函数
  function uploadFile(uptoken, key, localFile, fn) {
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
        //console.log(ret.hash, ret.key);
      } else {
        // 上传失败， 处理返回代码
        //console.log(err);
      }
      fn(err, ret);
    });
  }

  //调用uploadFile上传
  uploadFile(token, key, filePath, fn);
}

module.exports = {
  upload: upload
}