import axios from "axios";
// import JSEncrypt from "jsencrypt";

//接口地址
const apiurl = "http://121.41.112.205:8088";

//图片拼接路径
const imgurl = "http://121.41.112.205:8088/img/images?fileName=";


//导出exo
const dowex = (params = {}, url = "", name = "") => {
    const that = this;
    const link = document.createElement("a");
    var httpurl = apiurl + url;
    axios
        .post(httpurl, params, {
            responseType: "arraybuffer",
            headers: {
                token: localStorage.getItem("token"),
            },
        })
        .then((res) => {
            var enc = new TextDecoder("utf-8");
            try {
                var resa = JSON.parse(enc.decode(new Uint8Array(res.data))); //转化成json对象
                Message({
                    message: "请选择筛选条件后导出",
                    type: "warning",
                });
            } catch (err) {
                // 	// 创建Blob对象，设置文件类型
                let blob = new Blob([res.data], {
                    type: "application/vnd.ms-excel",
                });
                let objectUrl = URL.createObjectURL(blob); // 创建URL
                link.href = objectUrl;
                link.download = name || "文件"; // 自定义文件名
                link.click(); // 下载文件
                URL.revokeObjectURL(objectUrl); // 释放内存
            }
        });
};

// 加密
const setpwd = (e) => {
    var encryptor = new JSEncrypt(); // 创建加密对象实例
    //之前ssl生成的公钥，复制的时候要小心不要有空格
    var pubKey = `-----BEGIN PUBLIC KEY-----
  MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCvLt846uqH9HO87TUsv71t+gvt
  cDRV4CAAxcbyTNBiM1XCcjRo5BggZdEIfyZfm+9lsPvNd1p01bz0LUGpuuuRHAYF
  uMItlWNE8m3kUeY/hFOu8Dx2BitiE3os1hqe6Aqfm77SMlrJKzxMhdVUrlLBcpnS
  I/rG6Ul8DG+R5lVcNwIDAQAB
  -----END PUBLIC KEY-----`;
    encryptor.setPublicKey(pubKey); //设置公钥
    var rsaPassWord = encryptor.encrypt(e); // 对内容进行加密
    return rsaPassWord;
};
// 解密
const getpwd = (e) => {
    var decrypt = new JSEncrypt(); //创建解密对象实例
    //之前ssl生成的秘钥
    var priKey = `-----BEGIN PRIVATE KEY-----
  MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAK8u3zjq6of0c7zt
  NSy/vW36C+1wNFXgIADFxvJM0GIzVcJyNGjkGCBl0Qh/Jl+b72Ww+813WnTVvPQt
  Qam665EcBgW4wi2VY0TybeRR5j+EU67wPHYGK2ITeizWGp7oCp+bvtIyWskrPEyF
  1VSuUsFymdIj+sbpSXwMb5HmVVw3AgMBAAECgYB7wwV41J30hsLtijey8ZMGi0y5
  5jdTJA/3+8HdlF7zwYio4r4cDGjvGn9fHVUi3qt2kF6Ufemt+QKRDxgArUmWA5Eo
  TREu+kCe5TZVErBoKTapCsU0nAQox1y87z4AL8OUpn2vh7eK85Odu8SCvmQQ+bmd
  O6K+W1QLBwCni6VN4QJBANbKSlmsfXZA7kRFRRvuVPVvubbjGRUP3R5x38kKkifR
  kicvnDA3CfnwbAaxAW8qnfN9tr1o4hSPeLjphxh+BfUCQQDQyzmwdzjZiQq4vun1
  mdD7fVissm4epDIcZEKiWxg95A5Zw2Uhko77sY/c4cMptdJAkl7TzddOZifj7MKG
  d1H7AkEAxv8YL0id3Gd/2ISM6LnAwLvIRebVICxYYpKCENLYYkfJrsBvZkQ32/ah
  PvnTKFlFiYeZPJbljsL1x+ukHE712QJBAJZVLQVc4ibm4Dxi4at/g5QADV/S3Szc
  xmPg4IVrl4nAcYC6Ck/g6WhZ0Z6VQuL+UhNCEFrqQ5LkROZ8KxeMRA8CQQDLozpz
  E9uZ4ejHKqYuzs948OeVXlqzUv97xFzACaQ2Trb+vJBWc+mER4C5pYASwsoTHp62
  SlQEhvq33tbPfqrx
  -----END PRIVATE KEY-----
  `;
    decrypt.setPrivateKey(priKey); //设置秘钥
    var uncrypted = decrypt.decrypt(e); //解密之前拿公钥加密的内容
    return uncrypted;
};

export default {
    dowex,
    setpwd,
    getpwd,
    apiurl,
    imgurl
};
