// APP相关参数和函数
var appId = "A6933358370367";
var appKey = "005400FF-1E5B-90D8-32A0-341A295C0D12";
//用户相关参数和函数
var userinfo = {}; //name,id,school,schoolid
var schoolinfo = {}; //$api.getStorage prov city id name

var logined = ''; //api.getPrefs,是否登录成功

function get_base_info() {
    logined = api.getPrefs({
        sync: true,
        key: 'logined'
    });
    if (logined == 'true') {
        userinfo = $api.getStorage('userinfo');
        schoolinfo = $api.getStorage('schoolinfo');
    }
}

function openNewWindow(winname, filename,Param) {
    api.openWin({
        name: winname,
        url: filename + '.html',
        pageParam: Param,
        bounces: false,
        opaque: false
    });
}

function openNew_Window_Frame(winname, win_filename, framename, frm_filename) {
    api.openWin({
        name: winname,
        url: win_filename + '.html',
        pageParam: {
            'framename': framename,
            'filename': frm_filename
        },
        bounces: false,
        opaque: false
    });
}

function UseropenNewWindow(pagename, filename) {
    if (logined == 'true') {
        api.openWin({
            name: pagename,
            url: filename + '.html',
            pageParam: {},
            bounces: false,
            opaque: false
        });
    } else {
        alert('请先登录！')
    }
}

function openNewFrame(dir_name) {
    api.openFrame({
        name: 'dir_name',
        url: './' + dir_name + '/index.html',
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        bounces: false,
        opaque: false
            // vScrollBarEnabled:false,
            // hScrollBarEnabled:false
    });
}

function closeWin() {
    api.closeWin({});
}

function keybackEventListener() {
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        if (ret) {
            console.log(JSON.stringify(ret)); //{"keyCode":4,"longPress":false}
            //
        } else {
            console.log(JSON.stringify(err));
        }
    });
}

function exit_app() {
    api.closeWidget({
        id: 'A6933358370367',
        retData: {
            name: 'closeWidget'
        },
        animation: {
            type: 'flip',
            subType: 'from_bottom',
            duration: 500
        }
    });
}

function find_school_byid(ssid) {

}

function get_school(callback) {
    var UIActionSelector = api.require('UIActionSelector');
    UIActionSelector.open({
        datas: 'widget://res/school.json',
        layout: {
            row: 5,
            col: 3,
            height: 35,
            size: 12,
            sizeActive: 12,
            rowSpacing: 5,
            colSpacing: 5,
            maskBg: 'rgba(0,0,0,0.2)',
            bg: '#fff',
            color: '#888',
            colorActive: '#f00',
            colorSelected: '#f00'
        },
        animation: true,
        cancel: {
            text: '取消',
            size: 12,
            w: 90,
            h: 35,
            bg: '#fff',
            bgActive: '#ccc',
            color: '#888',
            colorActive: '#fff'
        },
        ok: {
            text: '确定',
            size: 12,
            w: 90,
            h: 35,
            bg: '#fff',
            bgActive: '#ccc',
            color: '#888',
            colorActive: '#fff'
        },
        title: {
            text: '请选择',
            size: 12,
            h: 44,
            bg: '#eee',
            color: '#888'
        }
    }, function(ret, err) {
        if (ret) {
            console.log(JSON.stringify(ret));
            //{"eventType":"ok","level1":"江苏","level2":"淮安","level3":"淮阴工学院","selectedInfo":[{"name":"江苏"},{"name":"淮安"},{"name":"淮阴工学院","id":10001}]}
            //{"eventType":"cancel"}
            if (ret.eventType == 'ok' && ret.selectedInfo[2]) {
                schoolinfo.prov = ret.selectedInfo[0].name;
                schoolinfo.city = ret.selectedInfo[1].name;
                schoolinfo.id = ret.selectedInfo[2].id;
                schoolinfo.name = ret.selectedInfo[2].name;
                $api.setStorage('schoolinfo', schoolinfo);
                return callback(schoolinfo.name);
            }
        } else {
            console.log(JSON.stringify(err));
        }
    });
}
