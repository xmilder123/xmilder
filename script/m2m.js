// socket状态码-数字类型
// 取值范围：
// 101 //创建成功
// 102 //连接成功
// 103 //收到数据
// 201 //创建失败
// 202 //连接失败
// 203 //异常断开
// 204 //正常断开
// 205 //发生未知错误断开
// var socket = null;
// var ip = 'bookbox.cc';
// var port = 5200;

//获取url参数
function GetRequest(boxcode) {
    //url例子：XXX.aspx?ID=" + ID + "&Name=" + Name；
    //var url = location.search; //获取url中"?"符以及其后的字串
    var url = boxcode.substring(boxcode.indexOf('?'));
    console.log(url);
    var theRequest = new Object();
    if (url.indexOf("?") != -1) //url中存在问号，也就说有参数。
    {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    console.log(JSON.stringify(theRequest));
    return theRequest;
}

//获取数组长度
function getJsonObjLength(jsonObj) {
    var Length = 0;
    for (var item in jsonObj) {
        Length++;
    }
    return Length;
}

/**
 *删除数组指定下标或指定对象
 */
Array.prototype.remove = function(obj) {
    for (var i = 0; i < this.length; i++) {
        var temp = this[i];
        if (!isNaN(obj)) {
            temp = i;
        }
        if (temp == obj) {
            for (var j = i; j < this.length; j++) {
                this[j] = this[j + 1];
            }
            this.length = this.length - 1;
        }
    }
}

//读取书柜配置文件

var OnetNet_devID; //onenet 接入设备地址
var OnetNet_LoraID; //无线设备地址
var CurrentBoxDescribe; //当前书柜描述

function bboxListjson(curr_box) {
    var data = api.readFile({
        sync: true,
        path: 'widget://res/bboxList.json'
    });
    var bboxList_json = JSON.parse(data);
    if (bboxList_json[curr_box]) {
        OnetNet_devID = bboxList_json[curr_box]['devid'];
        OnetNet_LoraID = bboxList_json[curr_box]['lora_addr'];
        CurrentBoxDescribe = bboxList_json[curr_box]['describe'];
        return 1;
    } else {
        return 0;
    }
}

function OneNet_Dev_Online(devID, callback) {
    api.ajax({
        url: 'http://api.heclouds.com/devices/' + devID,
        method: 'get',
        dataType: 'json',
        headers: {
            //'Content-Type': 'application/json',
            'api-key': '3CkPfwUye28jx1CIrAVEgGRx=sE='
        }
    }, function(ret, err) {
        if (ret) {
            // {"errno":0,"data":{"private":false,"protocol":"EDP","create_time":"2017-05-10 21:16:40","online":true,"location":{"lat":0,"lon":0},"id":"5998795","auth_info":"hyit004","title":"淮阴工学院","tags":[]},"error":"succ"}
            //console.log(JSON.stringify(ret));
            return callback(ret.data.online);
        } else {
            //console.log(JSON.stringify(err));
            return callback(false);
        }
    });
}

function OneNet_Dev_command(devID, callback) {
    //alert(JSON.stringify(ret));
    var vbody= "{\"com\": " + "\"o\"" + ",\"box\":" + CurrentSubBox + ",\"dor\":" + seated + "}"
    console.log(vbody)
    api.ajax({
        url: 'http://api.heclouds.com/cmds?device_id=' + devID,
        method: 'post',
        dataType: 'json',
        headers: {
            //'Content-Type': 'application/json',
            'api-key': '3CkPfwUye28jx1CIrAVEgGRx=sE='
        },
        data: {
            body: vbody
        }
    }, function(ret, err) {
        console.log(JSON.stringify(ret) + JSON.stringify(err));
        if (ret.errno === 0) {
            //{"errno":0,"data":{"cmd_uuid":"0884eec2-6367-56b8-9c1b-9f913421e8c3"},"error":"succ"}
            //alert(JSON.stringify(ret));
            //console.log(JSON.stringify(ret));
            return callback(true);
        } else {
            return callback(false);
        }
    });
}

function Douban_Api_Isbn(isbn, field, callback) {
    api.showProgress({
        title: '进度条',
        text: '正在查询该书资料...',
        modal: true
    });
    api.ajax({
        url: 'https://api.douban.com/v2/book/isbn/' + isbn + '?fields=' + field,
        method: 'get',
        dataType: 'json',
        timeout: 30
    }, function(data, error) {
        if (data) {
            //console.log(JSON.stringify(data));
            api.hideProgress();
            return callback(data, 'Douban');
        } else {
            console.log(JSON.stringify(error));
            //如果豆瓣查不到，则搜索自有库
            query.createQuery(function(ret, err) {
                if (ret && ret.qid) {
                    var queryId = ret.qid;
                    query.whereEqual({
                        qid: queryId,
                        column: "isbn",
                        value: isbn
                    });
                    model.findAll({
                        class: "bookinfolib",
                        qid: queryId
                    }, function(mydata, error) {
                        console.log(JSON.stringify(mydata));
                        if (mydata[0]) {
                            if (field.indexOf("images") >= 0) { //如果字段要求有images
                                model.findById({
                                    class: 'file',
                                    id: mydata[0].images
                                }, function(mycov, err) {
                                    if (mycov) {
                                        console.log(JSON.stringify(mycov));
                                        delete mydata[0].images;
                                        mydata[0].images = {};
                                        mydata[0].images.large = mycov.url;
                                        api.hideProgress();
                                        return callback(mydata[0], 'Mylib');
                                    } else {
                                        console.log(JSON.stringify(err));
                                    }
                                });
                            } else {
                                api.hideProgress();
                                return callback(mydata[0], 'Mylib');
                            }
                        } else {
                            api.hideProgress();
                            return callback(null);
                        }
                    });
                }
            });
        }
    });
}

/*
//https://github.com/jobbole/awesome-python-cn
//CoAP协议共有4中不同的消息类型。
//CON——需要被确认的请求，如果CON请求被发送，那么对方必须做出响应。
//NON——不需要被确认的请求，如果NON请求被发送，那么对方不必做出回应。
//ACK——应答消息，如果接受到CON消息的响应。
//RST——复位消息，当接收者接受到的消息包含一个错误，接受者解析消息或者不再关心发送者发送的内容，那么复位消息将会被发送。
//{"T":1,"I":"hyit003","P":{"LO":1,"PI":"bookid","PT":"XXX"}} 打印
//{"T":2,"I":"hyit003"} 测试

function createSocket(callback) {
    socketManager.createSocket({
        host: ip,
        port: port
    }, function(ret, err) {
        if (ret) {
            //alert(JSON.stringify(ret));
            if (ret.state === 202) {
                return callback(null, '[连接异常]');
            }
            if (ret.state === 102) {
                socket_sid = ret['sid'];
                return callback('[连接正常]');
            }
        } else {
            alert(JSON.stringify(err));
        }
    });
}

function closeSocket(callback) {
    socketManager.closeSocket({
        sid: socket_sid
    }, function(ret, err) {
        if (ret.status) {
            //alert(JSON.stringify(ret));
            return callback();
        } else {
            alert(JSON.stringify(err));
        }
    });
}


function writeSocket(command, callback) {
    //https://github.com/fschr/simpletcp
    socketManager.write({
        sid: socket_sid,
        data: command
    }, function(ret, err) {
        if (ret.status) {
            // alert(JSON.stringify(ret));
            if (ret.status == 1) {
                return callback(ret.status);
            }
        } else {
            alert(JSON.stringify(err));
        }
    });
}
*/

// var val = 1;

// // 我们假设step1, step2, step3都是ajax调用后端或者是
// // 在Node.js上查询数据库的异步操作
// // 每个步骤都有对应的失败和成功处理回调
// // 需求是这样，step1、step2、step3必须按顺序执行
// function step1(resolve, reject) {
//     console.log('步骤一：执行');
//     if (val >= 1) {
//         resolve('Hello I am No.1');
//     } else if (val === 0) {
//         reject(val);
//     }
// }

// function step2(resolve, reject) {
//     console.log('步骤二：执行');
//     if (val === 1) {
//         resolve('Hello I am No.2');
//     } else if (val === 0) {
//         reject(val);
//     }
// }

// function step3(resolve, reject) {
//     console.log('步骤三：执行');
//     if (val === 1) {
//         resolve('Hello I am No.3');
//     } else if (val === 0) {
//         reject(val);
//     }
// }

// new Promise(step1).then(function(val){
//     console.info(val);
//     return new Promise(step2);
// }).then(function(val){
//     console.info(val);
//     return new Promise(step3);
// }).then(function(val){
//     console.info(val);
//     return val;
// }).then(function(val){
//     console.info(val);
//     return val;
// });

// // 执行之后将会打印
// // 步骤一：执行
// // Hello I am No.1
// // 步骤二：执行
// // Hello I am No.2
// // 步骤三：执行
// // Hello I am No.3
// // Hello I am No.3
