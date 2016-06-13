// Copyright 2016 caicloud authors. All rights reserved.

var _ = require('underscore');
var crypto = require('crypto');
var nodeUtil = require('util');

var mod = {};

_.extend(mod, nodeUtil);

_.extend(mod, {
  k8sUnit: function(s){
    return s.replace('i', 'B');
  },
  k8sUnitCPU: function(s){
    var n = s.replace('m', '') * 1;
    return  s.indexOf('m') > -1  ? n / 1000: n;
  }
});

_.extend(mod, {
  /**
   * md5加密
   * @param str
   * @returns {*}
   */
  md5: function(str){
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
  },

  /**
   * api接口返回的JSON结构
   * resJSON(0, {msg: '保存成功'});
   * resJSON(-1, {msg: '用户已存在'});
   * resJSON(err, {list: groupList});
   */
  res: function(status, o){
    var s = 0, t = {};
    if(typeof status == 'number'){
      s = status;
    }else{
      if(status == null){
        s = 0;
      }else{
        s = -1;
        t.msg = status.msg || '未知错误';
        t.err = status;
      }
    }
    t.code = s;

    return _.extend(t, o ? o : {});
  }
});

module.exports = mod;
