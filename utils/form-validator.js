






// 正则表
const REGLIST = {
	ImgCode: /^[a-zA-Z0-9]{4}$/,
	SmsCode: /^\d{4}$/,
	MailCode: /^\d{4}$/,
	UserName: /^[\w|\d]{4,16}$/,
	Password: /^[\w!@#$%^&*.]{6,16}$/,
	Mobile: /^1[3|4|5|7|8]\d{9}$/,
	RealName: /^[\u4E00-\u9FA5\uf900-\ufa2d\w]{4,16}$/,
	// RealName: /^[\u4e00-\u9fa5|·]{2,16}$|^[a-zA-Z|\s]{2,20}$/,
	BankNum: /^\d{10,19}$/,
	Money: /^([1-9]\d*|[0-9]\d*\.\d{1,2}|0)$/,
	Answer: /^\S+$/,
	Mail: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
}




/*
// 检测输入类
    	checkInput = {
						checkName : {
							errorInfo : "",
							index : 0,
							checkFunc : function(input,callback){
								var input = checkInput._trim(input),
									empty = false;
								input = checkInput._htmlFilter(input);
								empty = checkInput._checkEmpty(input);
								if(empty){
									this.errorInfo = "请输入姓名";
									return;
								}else{
									this.errorInfo = "";
							    	callback(input);
								}
							}
						},
						checkPhone : {
							errorInfo : "",
							index : 1,
							checkFunc : function(input,callback){
								var input = checkInput._trim(input);
								input = checkInput._htmlFilter(input);
							    if(!(/^1\d{10}$/.test(input))){
							    	this.errorInfo = "请输入正确的手机号";
							    	return;
							    }else{
							    	this.errorInfo = "";
							    	callback(input);
							    }
							},
						},
						checkEmail : {
							errorInfo : "",
							index : 2,
							checkFunc : function(input,callback){
								var input = checkInput._trim(input),
									empty = true;
								input = checkInput._htmlFilter(input);
								empty = checkInput._checkEmpty(input);
								if(empty){
									this.errorInfo = "";
								}else{
									if(!(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(input))){
										this.errorInfo = "请输入正确的邮箱";
										return;
									}else{
										this.errorInfo = "";
										callback(input);
									}
								}
							},
						},
						checkCompany : {
							errorInfo : "",
							index : 3,
							checkFunc : function(input,callback){
								var input = checkInput._trim(input),
									empty = true;
								input = checkInput._htmlFilter(input);
								callback(input);
							},
						},
						checkOccupation : {
							errorInfo : "",
							index : 4,
							checkFunc : function(input,callback){
								var input = checkInput._trim(input);
								input = checkInput._htmlFilter(input);
								callback(input);
							},
						},

						// 判空
						_checkEmpty : function(input){
							var input = checkInput._trim(input);
							if(input.length > 0) return false;
							return true;
						},
						// 去空
						_trim : function(input){
							var input = input.toString();
							if(input.trim)input = input.trim();
							input = input.replace(/\s/g,"");
							return input;
						},
						// 过滤非法字符
						_htmlFilter : function(input){
							var input = input;
							input = input.replace(/[\[\]<>\?]/g,"");
							return input;
						},
						// 判断能否提交
						_canSendOrNot : function(callback){
							for(i in this){
								if(i.toString()[0] === "_")continue;
								if(this[i].errorInfo.length > 0){
									if(callback)callback(this[i].index,this[i].errorInfo);
									return false;
								}
							}
							return true;
						}
					},
*/