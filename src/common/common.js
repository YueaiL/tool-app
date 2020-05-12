export default {

  base64toHEX(data) {
    let raw = atob(data);

    let HEX = '';
    console.log(typeof raw)
    for (let i = 0; i < raw.length; i++) {

      let _hex = raw.charCodeAt(i).toString(16)

      HEX += (_hex.length == 2 ? _hex : '0' + _hex);

    }
    return HEX.toUpperCase();
  },

  hexToBase64(data) {
    //十六进制转base64
    let result = '';
    for (let i = 0; i < data.length / 2; i++) {
      let hex = data.substring(i * 2, (i + 1) * 2);
      result += String.fromCharCode(parseInt(hex, 16));

    }
    return btoa(result);
  },
  checkSum(data) {
    let sum = 0;
    for (let i = 0; i < data.length/2; i++) {
      let s = data.substring(i*2,(i+1)*2);
      sum += parseInt(s,16);
    }
    let sumStr = sum.toString(16);
    if(sumStr.length >= 2){
      sumStr = sumStr.substring(sumStr.length-2,sumStr.length);
    }else {
      sumStr = sumStr.length == 1 ? '0'+sumStr : '00';
    }
    return sumStr;
  },


}

