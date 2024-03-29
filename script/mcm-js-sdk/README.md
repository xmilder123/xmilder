
##概述

APICloud的 JS SDK 是参考 angular-resource.js 类库,基于api.ajax而写成的原生 JavaScript 类库. 它与已经存在的 JavaScript 程序是兼容的, ,支持对象化操作,简化文件上传、多个文件上传、Relation相关操作,只需要在你的代码中做出一点点改变.因为是基于api.ajax的参数封装类库,所以可以做到最小的影响性能, 最小化配置, 让你很快地用在 APICloud 上使用 JavaScript 和 HTML5.



###**配置**


```js
Resource("appId", "appKey","url");
```

####参数

appId：

- 类型：字符串
- 默认值：无
- 描述：应用的id,在APICloud上应用概览里获取,不能为空

appKey：

- 类型：字符串
- 默认值：无
- 描述：应用的安全校验Key,在APICloud上应用概览里获取,不能为空

url：

- 类型：字符串
- 默认值：无
- 描述：应用服务器地址,可为空,为空时默认为编译时的服务器地址

####示例代码

```js
var client = new Resource("appId", "appKey");
```

###**设置参数**

```js
.setHeaders("key", "value");
```

####参数

key：

- 类型：字符串
- 默认值：无
- 描述：header的名字

value：

- 类型：字符串
- 默认值：无
- 描述：header的值


####示例代码

```js
var client = new Resource("appId", "appKey");
client.setHeaders("authorization",$api.getStorage('token'));//注销以及ACL的时候需要设置authorization
```

###**生成一个对象实例**

```js
.Factory("className");
```

####参数

className：

- 类型：字符串
- 默认值：无
- 描述：与您设置的classname保持一致



####示例代码

```js
var client = new Resource("appId", "appKey");
var Model = client.Factory("modelName");
```


##rest基本操作

###**增加**

向对象插入一条数据
.save({body}, callback(ret,err))

####body

value：

- 类型：JSON对象
- 默认值：无
- 描述：插入的键值对,与服务器上class中键值对应,不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：插入成功后对应的该条数据在服务器的所有键值

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js

var Model = client.Factory("modelName");

Model.save({"username": username, "password": password,email:email}, function (ret,err) {
  console.log("Model insert:"+JSON.stringify(ret))
  console.log("Model insert:"+JSON.stringify(err))
});

```


###**删除**

根据ID删除对象的一条数据

.delete({params}, callback(ret, err))


####params

_id：

- 类型：字符串
- 默认值：无
- 描述：被删除数据的行ID,不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息,成功返回{}空对象

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js

var Model = client.Factory("modelName");

Model.delete({
  "_id": "{{you id}}"
}, function (ret,err) {
  console.log("aa all delete:"+JSON.stringify(ret));
});

```


###**更新**

根据ID更新对象的一条数据

.save({params},{body},callback(ret, err))

####params

id：

- 类型：字符串
- 默认值：无
- 描述：将要更新数据的行ID,不能为空

####body

value：

- 类型：JSON
- 默认值：无
- 描述：将要更新的键值对,与服务器上class中键值对应,不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：更新成功后对应的该条数据在服务器的所有键值

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var Model = client.Factory("modelName");

Model.save({"_id":id},{email:email,emailVerified:true},function(ret,err){
    console.log("Model update:"+JSON.stringify(ret));
});
```

###**根据id获取数据**

根据ID查找对象的一条数据

.get({params}, callback(ret, err))

####params

_id：

- 类型：字符串
- 默认值：无
- 描述：被查找数据的行ID,不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：查找成功后对应的该条数据在服务器的所有键值

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var Model = client.Factory("modelName");

Model.get({"_id": id}, function (ret,err) {
    console.log("Model get:"+JSON.stringify(ret))
});
```



###**查询所有数据**

根据条件查找对象中所有符合条件的数据

.query({params}, callback(ret, err))

####params

filter：

- 类型：JSON对象
- 默认值：无
- 描述：查询条件的键值对

####callback(ret, err)

ret：

- 类型：JSON数组
- 描述：查找成功后对应的所有满足条件的数据

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var Model = client.Factory("modelName");

Model.query(function (ret,err) {
    console.log("Model query:"+JSON.stringify(ret))
});

Model.query({
  filter:{
    where:{
      "name":"APICloud",
      "age":{"gt":20}
    },
    fileds:["id","name","age"],
    skip:0,
    limit:10,
    include:"users",
    includefilter:{
      "user":{
        where:{
          "name":"aa"
        }
      }
    }
  }
},function (ret,err) {
    console.log("Model query:"+JSON.stringify(ret))
});

```

###**查询数据条数**

根据条件返回对象下满足该条件的总记录数

.count({params}, callback(ret, err))

####params

filter：

- 类型：JSON对象
- 默认值：无
- 描述：查询条件的键值对

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var Model = client.Factory("modelName");

Model.count(function (ret,err) {
    console.log("Model count:"+JSON.stringify(ret))
});
```

###**判断对象是否存在**

查询某对象/对象下某行是否存在

.exists({params}, callback(ret, err))

####params

_id：

- 类型：字符串
- 默认值：无
- 描述：被查找数据的行ID,可为空,为空时返回对象是否存在

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var Model = client.Factory("modelName");

Model.exists(function (ret,err) {
    console.log("Model exists:"+JSON.stringify(ret))
});
```


##rest文件操作

###**文件上传**

上传文件到云端file表里面

.save({body}, callback(ret, err))

####body

value

- 类型：JSON对象
- 默认值：无
- 描述：提交的文件及相关数据,不能为空
- 内部字段：

```js
{
  file:			//文件对象名称,file表为file,file字段则为具体名称
  {
    isFile:true,	//标示对象是一个文件对象
	  isFileClass:true,//标示当前是对file表进行操作,file表作为Relation表的时候必须
    path:'',		//文件地址
    values:{}//自定义字段或者filename
  }
};
```
####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息,服务器返回的数据

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
//对file表进行操作
var File = client.Factory("file");

api.getPicture({},function(ret,err){
    File.save({file:{isFile:true,path:ret.data,values:{filename:"头像.png"}}},function(data,err){
        alert("file:\t"+JSON.stringify(data));
        alert("file:\t"+JSON.stringify(err));
    })
})

//多文件上传,一个表有多个file字段
var bb = client.Factory("bb");
api.getPicture({},function(ret,err){
    var path1=ret.data;
    api.getPicture({},function(ret,err){
    var path2=ret.data;
    bb.save({file1:{isFile:true,path:path1},file2:{isFile:true,path:path2}},function(data,err){
            alert(JSON.stringify(data));
        })
  });
})

//file表作为Relation表,isFileClass必须设置,否则无法上传
var RelationFile = client.Factory("relationFile");
api.getPicture({},function(ret,err){
    RelationFile.save({"_id":"{{id}}","_relation":"{{relationName}}"},{file:{isFileClass:true,isFile:true,path:ret.data}},function(data,err){
        alert("file:\t"+JSON.stringify(data));
        alert("file:\t"+JSON.stringify(err));
    })
})
```


##Relation相关操作

####概述
主要用于对一张表中数据类型为Relation的列进行操作

###**增加**

向对象的某关系列下插入一条内容

.save({params},{body}, callback(ret, err))

####params

_id：

- 类型：字符串
- 默认值：无
- 描述：被插入对象ID,不能为空

_relation：

- 类型：字符串
- 默认值：无
- 描述：关系列的名称,对应服务器上的同名relation,不能为空

####body

value：

- 类型：JSON对象
- 默认值：无
- 描述：插入的键值对,与服务器上class中键值对应,不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var Model = client.Factory("modelName");

Model.save({"_id":"xxxxxxxxxxxxxx","_relation":"many"},{"username": username, "password": password,email:email}, function (ret,err) {
  console.log("Model insert:"+JSON.stringify(ret))
  console.log("Model insert:"+JSON.stringify(err))
});
```


###**数据条数**

查找对象某关系列下对应的数据总条数

.count({params}, callback(ret, err))

####params

_id：

- 类型：字符串
- 默认值：无
- 描述：被查找对象ID,不能为空

_relation：

- 类型：字符串
- 默认值：无
- 描述：关系列的名称,对应服务器上的同名relation,不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息


####示例代码

```js
var Model = client.Factory("modelName");

Model.count({"_id":"xxxxxxxxxxxxxx","_relation":"many"}, function (ret,err) {
  console.log("Model count:"+JSON.stringify(ret))
  console.log("Model count:"+JSON.stringify(err))
});
```

###**获取**

获取对象某关系列下对应的所有数据

.get({params}, callback(ret, err))

####params

id：

- 类型：字符串
- 默认值：无
- 描述：被查找对象ID,不能为空

_relation：

- 类型：字符串
- 默认值：无
- 描述：关系列的名称,对应服务器上的同名relation,不能为空

####callback(ret, err)

ret：

- 类型：JSON数组
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js

var Model = client.Factory("modelName");

Model.get({"_id":"xxxxxxxxxxxxxx","_relation":"many"}, function (ret,err) {
  console.log("Model count:"+JSON.stringify(ret))
  console.log("Model count:"+JSON.stringify(err))
});
```


###**删除**

删除对象某关系列下对应的所有数据

.delete({params}, callback(ret, err))

####params

id：

- 类型：字符串
- 默认值：无
- 描述：被删除对象ID,不能为空

_relation：

- 类型：字符串
- 默认值：无
- 描述：关系列的名称,对应服务器上的同名relation,不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var Model = client.Factory("modelName");

Model.delete({"_id":"xxxxxxxxxxxxxx","_relation":"many"}, function (ret,err) {
  console.log("Model count:"+JSON.stringify(ret))
  console.log("Model count:"+JSON.stringify(err))
});
```

##用户相关

####概述
user对象提供用户独有操作,如登录、注销、发送重置密码邮件、发送验证邮件。

###**login**

登录

.login({params}, callback(ret, err))

####params

username：

- 类型：字符串
- 默认值：无
- 描述：用户名,不能为空

password：

- 类型：字符串
- 默认值：无
- 描述：密码,不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var User = client.Factory("user");

User.login({username: username, password: password}, function (ret,err) {
  console.log("user.login:"+JSON.stringify(ret))
  console.log("user.login:"+JSON.stringify(err))
});
```


###**logout**

注销登录

.logout(callback(ret, err))

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
//注销以及ACL的时候需要设置authorization
client.setHeaders("authorization",$api.getStorage('token'));
var User = client.Factory("user");

User.logout({token: token}, function (ret,err) {
    console.log("user.logout:"+JSON.stringify(ret))
});

```


###**verify**

发送验证邮件

.verify({params}, callback(ret, err))

####params

email：

- 类型：字符串
- 默认值：无
- 描述：需要验证的邮箱

username：

- 类型：字符串
- 默认值：无
- 描述：需要验证的用户名

language：

- 类型：字符串
- 默认值：无
- 描述：邮件需要使用的语言,为了应多多语言,中文（zh_CN）,英文（en_US）

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var User = client.Factory("user");

User.verify({"email":email, "language":"zh_CN", "username":username},function(ret,err){
    console.log("verify ret:\t"+JSON.stringify(ret))
})
```

###**reset**

发送重置密码邮件

.reset({params}, callback(ret, err))

####params

email：

- 类型：字符串
- 默认值：无
- 描述：需要验证的邮箱

username：

- 类型：字符串
- 默认值：无
- 描述：需要验证的用户名

language：

- 类型：字符串
- 默认值：无
- 描述：邮件需要使用的语言,为了应多多语言,中文（zh_CN）,英文（en_US）

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var User = client.Factory("user");

User.reset({"email":email, "language":"zh_CN", "username":username},function(ret,err){
    console.log("reset ret:\t"+JSON.stringify(ret))
})
```
##查询参数

####示例代码

```js

var Model = client.Factory("modelName");

Model.query({filter：{
	where：{},
	skip：0,
	limit：10,
	order："id DESC",
	include:"relation"
}}, function (ret,err) {
  console.log("Model count:"+JSON.stringify(ret))
  console.log("Model count:"+JSON.stringify(err))
});


```

fields、limit、order、skip、where、include、includefilter相关参数请参考[云api文档](http://docs.apicloud.com/%E4%BA%91API/data-cloud-api#6)

##批量查询

.batch(requests,callback(ret,err))

**提示**
batch为全局函数,即只能在Resouce对象上调用

**示例**

```js
var client = new Resource("appId", "appKey");
client.batch()
```

####requests
- 类型：JSON对象数组
- 描述：每个对象是一个请求信息

**示例** 


method为POST、PUT的时候需要在body内传值,为GET的时候不需要传递body
path路径为相对路径

**GET**
```js
{
    "method": "GET",
    "path": "/mcm/api/company",
}
//或者

{
    "method": "GET",
    "path": '/mcm/api/company?filter={"where":{"name":"APICloud"},"skip":0,"limit":1}',
}

{
    path:"/mcm/api/company?dt=111121323",//?之后的会被忽略
    method:"GET",
    body:{
      filter:{
        where:{
          "name":"APICloud"
        },
        skip:0,
        limit:1
      }
   }
}    
//以上两者是等价关系
```

**POST**
```js
{
    "method": "POST",
    "path": "/mcm/api/company",
    "body": {
      "name": "apicloud",
      "address": "北京市..."
    }
}
```

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：成功信息

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码

```js
var requests=[
    {
        "method": "GET",
        "path": "/mcm/api/company",
    },
    {
        "method": "POST",
        "path": "/mcm/api/company",
        "body": {
          "name": "apicloud",
          "address": "北京市..."
        }
    }
]
client.batch(requests, function (ret,err) {
  console.log("batch:"+JSON.stringify(ret))
  console.log("batch:"+JSON.stringify(err))
});

```

返回ret结果为一个顺序数组

```js
[
 {
    //request 1的结果 
 },
 [
    //request 2的结果
 ],
 ...
 {
     //request N的结果
 }   
]
```

##短信验证码

###**发送短信验证码**

根据手机号发送短信验证码

.sendvercode({params}, callback(ret, err))

####params

mobile:

- 类型：字符串
- 默认值：无
- 描述：手机号，不能为空

imageCode:

- 类型：字符串
- 默认值：无
- 描述：图片验证码，如果开启图片验证码功能则不能为空

token:

- 类型：字符串
- 默认值：无
- 描述：图片验证码的标识，如果开启图片验证码功能则不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：发送成功则返回{successful:true}

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码
```js

var Model = client.Factory("user");

Model.sendvercode({
  "mobile": {{手机号}}, 
  "imageCode": {{图片验证码}},
  "token":{{图片验证码标识}}
}, function (ret,err) {
  if(!err&&ret.successful){
    //发送成功
  }else{
    //发送失败
  }
});

```

###**校验短信验证码**

根据手机号校验短信验证码

.checkvercode({params}, callback(ret, err))

####params

mobile:

- 类型：字符串
- 默认值：无
- 描述：手机号，不能为空

vercode:

- 类型：字符串
- 默认值：无
- 描述：短信验证码，不能为空


####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：发送成功则返回{successful:true}

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码
```js

var Model = client.Factory("user");

Model.checkvercode({
  "mobile": {{手机号}}, 
  "vercode": {{短信验证码}}
}, function (ret,err) {
  if(!err&&ret.successful){
    //发送成功
  }else{
    //发送失败
  }
});

```

###**短信验证码重置密码**

根据手机号短信验证码重置密码

.resetByMobile({params}, callback(ret, err))

####params

mobile:

- 类型：字符串
- 默认值：无
- 描述：手机号，不能为空

vercode:

- 类型：字符串
- 默认值：无
- 描述：短信验证码，不能为空

username:

- 类型：字符串
- 默认值：无
- 描述：用户名，不能为空

password:

- 类型：字符串
- 默认值：无
- 描述：密码，不能为空

####callback(ret, err)

ret：

- 类型：JSON对象
- 描述：发送成功则返回{successful:true}

err：

- 类型：JSON对象
- 描述：错误信息

####示例代码
```js

var Model = client.Factory("user");

Model.resetByMobile({
  "mobile": {{手机号}}, 
  "vercode": {{短信验证码}},
  "username": {{用户名}},
  "password": {{密码}}
}, function (ret,err) {
  if(!err&&ret.successful){
    //发送成功
  }else{
    //发送失败
  }
});

```