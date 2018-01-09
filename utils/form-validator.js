









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