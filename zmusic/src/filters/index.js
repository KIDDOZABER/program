export function formatSeconds(value) {
  var theTime = parseInt(value);
  var second = 0; // 秒
  var middle = 0; // 分
  var hour = 0; // 小时

  if (theTime > 60) {
    middle = parseInt(theTime / 60);
    second = parseInt(theTime % 60);
    if (middle > 60) {
      hour = parseInt(middle / 60);
      middle = parseInt(middle % 60);
    }
  } else {
    second = theTime
  }

  var result = "0" + parseInt(second);
  result = result.substr(-2, 2)
  if (middle > 0) {
    result = ("0" + parseInt(middle)).substr(-2, 2) + " : " + result;
  } else {
    result = "00 : " + result;
  }
  if (hour > 0) {
    result = "" + parseInt(hour) + " : " + result;
  }

  return result;
}

export function timestampToTime(timestamp) {
  var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}
