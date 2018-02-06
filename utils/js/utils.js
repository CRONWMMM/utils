/**
 * author: CRONWMMM
 * github: https://github.com/CRONWMMM
 * 
 * version: v0.0.1
 * date: 2017.9.22
 *
 * ------------------------------------------------------------------------------------------------------------------------------
 *
 * version: v0.0.2
 * date: 2017.12.24
 * 
 * o(￣ヘ￣o#)
 *
 * 
 */


'use strict';
























/* base ------------------------------------------------------------------------------------------------------------------------ */
	/**
	 * 检测传入的参数类型
	 * @param obj {All}	需要进行参数检测的对象
	 * @return {String} 所属类型字符串
	 */
	function typeOf (obj) {
		const toString = Object.prototype.toString;
		const map = {
			'[object Boolean]'	 : 'boolean',
			'[object Number]' 	 : 'number',
			'[object String]' 	 : 'string',
			'[object Function]'  : 'function',
			'[object Array]' 	 : 'array',
			'[object Date]' 	 : 'date',
			'[object RegExp]'	 : 'regExp',
			'[object Undefined]' : 'undefined',
			'[object Null]' 	 : 'null',
			'[object Object]' 	 : 'object'
		};
		return map[toString.call(obj)];
	}
	function isNumber(obj) {
		return typeOf(obj) === 'number' ? true : false
	}
	function isString(obj) {
		return typeOf(obf) === 'string' ? true : false
	}
	function isFunction(obj) {
		return typeOf(obj) === 'function' ? true : false
	}
	function isArray(obj) {
		return typeOf(obj) === 'array' ? true : false
	}
	function isObject(obj) {
		return typeOf(obj) === 'object' ? true : false
	}



	/**
	 * 判空函数
	 * @param  {obj/arr/str}  检测对象
	 */
	function empty(obj){
		if(typeof obj === "object"){
			if(Array.isArray(obj)){			// array
				return !obj.length>0
			}else{							// object
				return !(function(obj){
					var key,
						len = 0;
					for (key in obj){
						len = ++len;
					}
					return len;
				})(obj)>0;
			}
		}else if(typeof obj === "string"){	// string
			return !(obj.trim()).length>0
		}else{								// error
			throw new Error("empty函数接收的参数类型：对象、数组、字符串");
		}
	}
	 



	/**
	 * 拷贝函数 【自己写的，推荐用下面一种】
	 * @param target {object} 需要拷贝的目标对象
	 * @param deep {boolean} 是否执行深拷贝
	 * @returns {object} 拷贝完成的对象
	 */
	function extend(target,deep){
		var argslength,target,copy,deep,i,len;

		argslength = arguments.length;

		target = argslength===0 ? {} : target;

		// 不传deep默认false，执行浅拷贝
		deep = argslength>1 ? deep : false;
		deep = typeof deep === "boolean" ? deep : false;

		if(Array.isArray(target)){						// 数组拷贝
			copy = [];
			for(i=0,len=target.length;i<len;i++){
				if(deep){
					copy[i] = extend(target[i],deep);
				}else{
					copy[i] = target[i];
				}
			}
		}else if(typeof target === 'object'){			// 对象拷贝
			copy = {};
			for(i in target){							// 这块需要做尾调用优化
				if(deep){
					copy[i] = extend(target[i],deep);
				}else{
					copy[i] = target[i];
				}
			}
		}else{
			copy = target;								// 这边函数就没判断，默认引用原有函数
		}
		return copy;
	}



	/**
	 * 深拷贝函数
	 * @param target {object} 需要拷贝的目标对象
	 * @returns {object} 拷贝完成的新对象
	 */
	 function deepCopy(target) {
	 	const flag = typeOf(target);
	 	let copy;

	 	if (flag === 'array') {
	 		copy = [];
	 		for (var i = 0, len = target.length; i < len; i++) {
	 			copy.push(deepCopy(target[i]));
	 		}
	 	}
	 	else if (flag === 'object') {
	 		copy = {};
	 		for (var k in target) {
	 			copy[k] = deepCopy(target[k]);
	 		}
	 	}
	 	else {
	 		copy = target;
	 	}
	 	return copy;
	 }



	/**
	 * 对象深度查找
	 * @param target Object 需要处理的原始对象
	 * @param callback filter函数
	 * @return Object 符合filter筛选条件的对应对象
	 *
	 * Test:
	 * var data = [
	 *					{
	 *						id: 1,
	 *						family: '隔壁老王家'
	 *						lists: [
	 *							{ id: 4, name: '老王老婆' },
	 *							{ id: 5, name: '老王儿子' },
	 *							{ id: 6, name: '老王儿媳' }
	 *						]
	 *					},
	 *					{
	 *						id: 2,
	 *						family: '隔壁老李家'
	 *						lists: [
	 *							{ id: 7, name: '老李小姨子' },
	 *							{ id: 8, name: '老李老婆' }
	 *						]
	 *					}
	 *				]
	 * findDeeply(data, item => item.id === 7)
	 *
	 *
	 *
	 *
	 * Expect:
	 * { id: 7, name: '老李小姨子' }
	 * 
	 */
	function findDeeply(target, callback) {
	    const flag = typeOf(target)
	    let result
	    if (flag === 'array') {
	        for (let i = 0, item; item = target[i++];) {
	            result = findDeeply(target[i], callback)
	            if (result) return result
	        }
	    }
	    else if (flag === 'object') {
	        if (callback(target)) {
	            return target
	        }
	        for (let k in target) {
	            result = findDeeply(target[k], callback)
	            if (result) return result
	        }
	    }
	}


	/**
	 * 对象深度查找【对象原型扩展】,和上面一个功能相同
	 * 调用方式：data.findDeeply(Func)
	 * @param target Object 需要处理的原始对象
	 * @param callback filter函数
	 * @return Object 符合filter筛选条件的对应对象
	 *
	 */
	(() => {
	    Object.prototype.findDeeply = function(callback) {
	        const flag = typeOf(this)
	        let result
	        if (flag === 'array') {
	            for (let i = 0, item; item = target[i++];) {
	                result = this[i].findDeeply(callback)
	                if (result) return result
	            }
	        }
	        else if (flag === 'object') {
	            if (callback(this)) {
	                return this
	            }
	            for (let k in this) {
	                result = this[k].findDeeply(callback)
	                if (result) return result
	            }
	        }
	    }
	})()






	/**
	 * 对象深度查找，返回list数组 【对象原型扩展】
	 * @param  {Array}    [arr]     每次深层递归返回的结果数组，作为下次递归的初始数组传入
	 * @param  {Function} callback  过滤函数
	 * @return {Array}              结果数组
	 *
	 *
	 * 注意：1.此方法内部使用了ES6扩展运算符、变量结构赋值等语法，需要支持ES6语法的环境
	 *       2.此方法针对原始对象进行处理，返回的数组对象，其内部包含的是 【原始对象/原始对象子对象】 的指针
	 *         所以此方法仅仅适合深层查找操作，并不适合修改操作，如果需要筛选过滤后的，请另写适配器返回新数据数组。
	 *       3.此方法属于扩展原型，所以运用在部分框架下可能有问题，比如Vue，会报错，需要另外改写成纯函数调用的形式
	 *
	 *
	 * Test: 
	 * var data = [
			{
				num: 0,
				type: 'father',
				sons: [
					{
						name: 'JAN',
						type: 'son',
						fatherid: 0,
						sons: [
							{name: 'hifa', type: 'son'}
						]
					},{
						name: 'KOA',
						type: 'son',
						fatherid: 0
					},{
						name: 'SEVENS',
						type: 'son',
						fatherid: 0
					}
				]
			},{
				num: 1,
				type: 'father',
				sons: [
					{
						name: 'READ',
						type: 'son',
						fatherid: 1
					},{
						name: 'OPERIY',
						type: 'son',
						fatherid: 1
					}
				]
			}
		];

		data.findDeeplyList(item => item.type === 'son')
	 *
	 *
	 *
	 *
	 * Expect: 
	 * (6) [{…}, {…}, {…}, {…}, {…}, {…}]
		0 : {name: "JAN", type: "son", fatherid: 0, sons: Array(1)}
		1 : {name: "hifa", type: "son"}
		2 : {name: "KOA", type: "son", fatherid: 0}
		3 : {name: "SEVENS", type: "son", fatherid: 0}
		4 : {name: "READ", type: "son", fatherid: 1}
		5 : {name: "OPERIY", type: "son", fatherid: 1}
		length : 6
		__proto__ : Array(0)
	 *
	 *
	 *
	 *
	 */
	(() => {
	    Object.prototype.findDeeplyList = function(arr, callback) {
	        const flag = typeOf(this)
	        if (typeOf(arr) === 'function') {
	        	[callback, arr] = [arr, []]
	        }

	        
	        if (flag === 'array') {
	            for (let i = 0; i < this.length; i++) {
	                this[i].findDeeplyList(arr, callback)
	            }
	        }
	        else if (flag === 'object') {
	            if (callback(this)) {
	                arr.push(this)
	            }
	            for (let k in this) {
	            	this[k].findDeeplyList(arr, callback)
	            }
	        }
	        return arr
	    }
	})()



	/**
	 * 自定义事件( 单例模式 )
	 */
	const EventTarget = (function() {
		let _evt = null

		function _EventTarget(){
			// 构造函数的容错处理
			if(this instanceof _EventTarget) {
				if(!this.handles) this.handles = {};
			}
			else {
				new _EventTarget();
			}
		}
		_EventTarget.prototype = {
			constructor : _EventTarget,
			// 注册事件，注意，这块注册的函数是否可以写成箭头函数，写成箭头函数的时候，在trigger阶段绑定this执行是否会有问题，有待研究
			addHandle : function(type,handler){
				var type = type.toString(),
					handlesArr = this.handles[type];
				if(typeof handlesArr === 'undefined')handlesArr = this.handles[type] = [];
				if(typeof handler === 'function')handlesArr.push(handler);
			},

			// 移除事件
			removeHandler : function(type,handler){
				var type = type.toString(),
					handlesArr = this.handles[type],i,len;
				if(typeof handler === 'undefined'){
					this.handles[type] = void(0);
					return ;
				}
				if(Array.isArray(handlesArr)){
					for(i=0,len=handlesArr.length;i<len;i++){
						if(handlesArr[i]===handler){
							handlesArr.splice(i,1);
							break;
						}
					}
				}
			},

			// 触发事件
			trigger : function(evt){
				var event = typeof evt === 'object' ? evt : { type: evt.toString() },
					type = event.type ? event.type.toString() : '',
					params = event.params && Array.isArray(event.params) ? event.params : [],
					handlesArr = this.handles[type];

				if(!event.target){
					event.target = this;
				}
				if(Array.isArray(handlesArr)){
					for(var i=0,len=handlesArr.length;i<len;i++){
						handlesArr[i].apply(event.target,params);
					}
				}
			}
		};

	    /**
	     * 惰性单例，返回的是一个待执行的函数，函数执行再实例化_evt

	    return function () {
	        if (!_evt) {
	            _evt = new _EventTarget()
	        }
	        return _evt
	    };

	     */

	    if (_evt && _evt instanceof _EventTarget) {
	        // do nothing
	    }
	    else {
	        _evt = new _EventTarget()
	    }
	    return _evt
	})()
	

	/**
	 * 辅助绑定函数
	 * @param  {Function} fn  [description]
	 * @param  {[type]}   obj [description]
	 * @return {[type]}       [description]
	 */
	function bind(fn,obj){
		return function(){
			return fn.apply(obj,arguments);
		}
	}


	/**
	 * 轮询函数【短轮询】（待完善）
	 * @param fn       {Function} 轮询条件函数，需要返回Boolean类型的值，来告诉系统是继续轮询还是停止轮询，暂时不支持传递参数，等后面有空用柯里化改写
	 * @param callback {Function} 轮询终止后执行的回调函数
	 * @param inter    {Number}   轮询间隔，单位ms，默认20ms
	 */
	const polling = (() => {
	    let timer = 0,
	    	ret
	    function polling(fn, callback inter=20) {
	        if (typeOf(fn) !== 'function') return console.error('polling方法第一个参数需要是函数')
	        if (timer) clearTimeout(timer)
	        timer = setTimeout(() => {
	            if (ret = fn()) {
	                clearTimeout(timer)
	                callback && callback()
	            } else {
	            	polling(fn, inter)
	            }
	        }, inter)
	    }
	    return polling
	})()




















/* cookie 操作 ------------------------------------------------------------------------------------------------------------- */
	
	/**
	 * 设置cookie/清除cookie
	 * @param name {string}	设置的cookie名
	 * @param value {string} 设置的cookie值
	 * @param myDay {number} cookie存在的天数（设置为负值可清除cookie）
	 */
	function setCookie(name,value,myDay){
	  var oDate=new Date();
	  oDate.setDate(oDate.getDate()+myDay);
	  document.cookie=name+'='+value+'; expires='+oDate;
	}



	/**
	 * 获取cookie
	 * @param name {string} 要获取的cookie名
	 * @returns {string} 返回的cookie值
	 */
	function getCookie(name){
	  //document.cookie获取当前网站的所有cookie
	  var arr=document.cookie.split('; ');
	  for(var i=0;i<arr.length;i++){
	    var arr1=arr[i].split('=');
	    if(arr1[0]==name){
	      return arr1[1];
	    }
	  }
	  return '';
	};




/* localStorage 操作 ----------------------------------------------------------------------------------------------------- */
	
	/**
	 * 设置localStorage
	 * @param key   {string} key
	 * @param value {string} value
	 */
	function setStorage (key, value) {
		if (!window.localStorage) 
			throw new Error('大兄弟，你的浏览器不支持localStorage'); 
		var storage = window.localStorage,
			key = typeof key === 'string' ? key : key.toString(),
			value = typeof value === 'string' ? value : JSON.stringify(value);
		storage.setItem(key, value);
	}


	/**
	 * 获取localStorage
	 * @param key   {string} key
	 */
	function getStorage (key) {
		if (!window.localStorage) 
			throw new Error('大兄弟，你的浏览器不支持localStorage'); 
		var storage = window.localStorage,
			key = typeof key === 'string' ? key : key.toString(),
			data = storage.getItem(key);
		return !!data ? JSON.parse(data) : null;
	}



	/**
	 * 移除所有localStorage
	 */
	function removeAllStorage () {
		if (!window.localStorage) 
			throw new Error('大兄弟，你的浏览器不支持localStorage'); 
		window.localStorage.clear();
	}


	/**
	 * 移除单个localStorage
	 * @param key   {string} key
	 */
	function removeStorage (key) {
		if (!window.localStorage) 
			throw new Error('大兄弟，你的浏览器不支持localStorage'); 
		var storage = window.localStorage,
			key = typeof key === 'string' ? key : key.toString();
		storage.removeItem(key);
	}
























/* userAgent 客户端检测 ------------------------------------------------------------------------------------------------------- */

	/**
	 * 移动设备类型判断
	 * @return {Object} 包含设备类型信息的对象
	 */
	function whichdevice(){
	    "use strict";
	    var device = {};
	    var ua = navigator.userAgent;
	    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
	    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
	    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
	    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

	    device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;

	    // Android
	    if (android) {
	        device.os = 'android';
	        device.osVersion = android[2];
	        device.android = true;
	        device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
	    }
	    if (ipad || iphone || ipod) {
	        device.os = 'ios';
	        device.ios = true;
	    }
	    // iOS
	    if (iphone && !ipod) {
	        device.osVersion = iphone[2].replace(/_/g, '.');
	        device.iphone = true;
	    }
	    if (ipad) {
	        device.osVersion = ipad[2].replace(/_/g, '.');
	        device.ipad = true;
	    }
	    if (ipod) {
	        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
	        device.iphone = true;
	    }
	    // iOS 8+ changed UA
	    if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
	        if (device.osVersion.split('.')[0] === '10') {
	            device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
	        }
	    }

	    // Webview
	    device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);
	    // keng..
	    device.isWeixin = /MicroMessenger/i.test(ua);
	    return device;
	};

	/**
	 * 用户浏览器内核判断
	 * @return {String / (Boolean)} 浏览器内核名称 (检测不到返回false)
	 */
	const clientJudge = (() => {

		let elStyle = document.createElement('div').style

		const transformName = {
			webkit: 'webkitTransform',
			O: 'OTransform',
			ms: 'msTransform',
			standard: 'transform'
		}

		for (let k in transformName) {
			if (elStyle[transformName[k]] !== undefined) {
				return k
			}
		}
		return false

	})()
















/* prefix 添加前缀 ------------------------------------------------------------------------------------------------------------- */
	/**
	 * JS动态添加行内样式前缀
	 * @return {String} 处理过的样式名称
	 */
	function prefixStyle(style) {
		if (typeof clientJudge === 'undefined') console.error('还没判断浏览器类型，调用个鸡儿的prefixStyle方法啊 (╯°Д°)╯︵ ┻━┻') 
		if (clientJudge === false) {
			console.error(`你的浏览器不支持 ${style} 属性`)
		}
		else if (clientJudge === 'standard') {
			return style
		}
		else {
			return clientJudge + style.charAt(0).toUpperCase() + style.substr(1)
		}
	}






















/* Url 操作 ------------------------------------------------------------------------------------------------------------- */

	/**
	 * 获取网页地址栏url的参数
	 * @param name {string} url的key
	 * @returns {string}
	 */
	function getUrlParam(name){
	  var name = encodeURIComponent(name);
	      arr = new RegExp("(^|&)" + name + "=([^&]*)(&|$)").exec(window.location.search.substr(1));
	  if(arr){
	    return RegExp.$2;
	  }else{
	    return '';
	  }
	}



	/**
	 * queryString和url进行拼接
	 * @param data {object} 需要传递的键值对序列
	 * @returns {string} 处理完毕的queryString
	 *  类似：a=1&b=2&c=3
	 */
	function setUrlParam(data){
		var url = '';
		for (var k in data) {
			var value = data[k] !== undefined ? data[k] : ''
			url += '&' + k + '=' + encodeURIComponent(value)
		}
		return url ? url.substring(1) : '';
	}


























/* 工具类函数 ----------------------------------------------------------------------------------------------------- */
	
	/**
	 * 倒计时函数
	 * @param  {number}   seconds   总计时秒数
	 * @param  {number}   execution 倒计时运行过程中的执行逻辑 (选传)
	 * @param  {Function} callback  时间走完后的回调函数 (选传)
	 * @return {[type]}            [description]
	 */
	function countDown(){
		var seconds = arguments[0] || 0,	// 总计时（s）
			length = arguments.length,
			execution,						// 计时过程中的执行逻辑
			callback;						// 回调

		if(length>1){
			callback = arguments[length-1];
		}

		if(length > 2){
			execution = arguments[1];
		}

		if(seconds>0){
			if(execution && typeof execution === 'function')execution();
			setTimeout(function(){
				seconds--;
				countDown(seconds,execution,callback);
			},1000);
		}else{
			if(callback && typeof callback === 'function')callback();
			return ;
		}
	}


	/**
	 * cavas图片压缩
	 * @param  {[type]}   file     [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	function imgResize(file,callback){
		var fileReader = new FileReader();
		fileReader.onload = function(){
		    var IMG = new Image();
		    IMG.src = this.result;
		    IMG.onload = function(){
		      var w = this.naturalWidth, h = this.naturalHeight, resizeW = 0, resizeH = 0;
		      // maxSize 是压缩的设置，设置图片的最大宽度和最大高度，等比缩放，level是报错的质量，数值越小质量越低
		      var maxSize = {
		        width: 500,
		        height: 500,
		        level: 0.6
		      };
		      if(w > maxSize.width || h > maxSize.height){
		        var multiple = Math.max(w / maxSize.width, h / maxSize.height);
		        resizeW = w / multiple;
		        resizeH = h / multiple;
		      } else {
		        // 如果图片尺寸小于最大限制，则不压缩直接上传
		        return callback(IMG)
		      }
		      var canvas = document.createElement('canvas'),
		      ctx = canvas.getContext('2d');
		      if(window.navigator.userAgent.indexOf('iPhone') > 0){
		        canvas.width = resizeH;
		        canvas.height = resizeW;
		        ctx.rotate(90 * Math.PI / 180);
		        ctx.drawImage(IMG, 0, -resizeH, resizeW, resizeH);
		      }else{
		        canvas.width = resizeW;
		        canvas.height = resizeH;
		        ctx.drawImage(IMG, 0, 0, resizeW, resizeH);
		      }
		      var base64 = canvas.toDataURL('image/jpeg', maxSize.level);
		      convertBlob(window.atob(base64.split(',')[1]), callback);
		    }
		  };
		  fileReader.readAsDataURL(file);
	}

	/**
	 * base64转换二进制
	 * @param  {[type]}   base64   [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	function convertBlob(base64, callback){
	  var buffer = new ArrayBuffer(base64.length);
	  var ubuffer = new Uint8Array(buffer);
	  for (var i = 0; i < base64.length; i++) {
	    ubuffer[i] = base64.charCodeAt(i)
	  }
	  var blob;
	  // android设备不支持Blob构造函数，用try catch
	  try {
	    blob = new Blob([buffer], {type: 'image/jpg'});
	  } catch (e) {
	    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
	    if(e.name === 'TypeError' && window.BlobBuilder){
	      var blobBuilder = new BlobBuilder();
	      blobBuilder.append(buffer);
	      blob = blobBuilder.getBlob('image/jpg');
	    }
	  }
	  callback(blob);
	}



	/**
	 * 批量预加载图片函数
	 * @param IMGArr Array 需要预加载的图片地址
	 * @param CBEvery Func 每次完成后的回调函数
	 * @param CBfinal Func 全部完成后的回调函数
	 * @return null 
	 * 
	 */
	function preloadIMG(IMGArr,CBEvery,CBfinal){
		var img;
		IMGArr.forEach(function(item, index, array){
			if(typeof item === "string"){
				img = new Image();
				img.onload = function(){
					this.onload = null;
					CBEvery.call(this);
				};
				img.src = item;
			}
		});
		CBfinal();
	}




















	




/* css 相关处理函数 ------------------------------------------------------------------------------- */

	/**
	 * 设置Html的font-size，rem单位自适应
	 * @param size Number 设计图尺寸[px] default 640
	 * 推荐尺寸设置：640 750
	 * 
	 * Init like this:
	 * 
	 * AutoPage();
	 * window.addEventListener('resize', AutoPage, false);
	 * 
	 */
	function AutoPage(size) {
		var size = (size - 0).toString() !== 'NaN' ? size : 640;
		// console.log(document.documentElement.clientWidth);
	    document.documentElement.style.fontSize = document.documentElement.clientWidth * 100 / size + 'px';
	};





























/* 数组操作 -------------------------------------------------------------------------------------- */
	
	/**
	 * 按照英文字母对数组排序，代码仍需改进，不是很健壮
	 * @param arr Array 需要进行排序操作的数组对象
	 * @param [key] String 如果传入的话必须是作为Key值的字符串
	 * 告诉程序需要按照当前对象的哪个key对应的value值排序
	 *
	 * @param flag Boolean 是否倒序，默认false按正序排列，设置为true则倒序
	 * @return Array 返回排序后的数组对象
	 *
	 *
	 * Test1:
	 * var arr = ['D','B','G','e','F','a','z','T','A'];
	 * sortByInitials(arr);
	 * 
	 * Expect1:
	 * ["a", "A", "B", "D", "e", "F", "G", "T", "z"]
	 *
	 *
	 *
	 *
	 * 
	 * Test2:
	 * var arr = ['D','B','G','e','F','a','z','T','A'];
	 * sortByInitials(arr,true);
	 * 
	 * Expect2:
	 * ["z", "T", "G", "F", "e", "D", "B", "a", "A"]
	 *
	 *
	 *
	 * Test3:
	 * var arr = [{title: 'A'},{title: 'z'},{title: 'Q'},{title: 'w'},{title: 'v'}];
	 * sortByInitials(arr);
	 * 
	 * Expect3:
	 * [{title: 'A'},{title: 'Q'},{title: 'v'},{title: 'w'},{title: 'z'}]
	 * 
	 * 
	 */
	function sortByInitials(arr, key, flag) {
		return arr.sort(function (a, b) {
			var type = typeOf(key),
				regStr = 'boolean undefined',
				result = regStr.indexOf(type) >= 0,
				isReverse = result ? !!key : !!flag,
				prevVal = result ? a.toUpperCase() : a[key].toUpperCase(),
				nextVal = result ? b.toUpperCase() : b[key].toUpperCase();
			return !isReverse ? prevVal.charCodeAt() - nextVal.charCodeAt() : 
						  		nextVal.charCodeAt() - prevVal.charCodeAt() 
		})
	}



	/**数组扁平化，拉伸数组
	 * @param arr Array 需要操作的数组对象
	 * @return Array 返回拉伸后的数组对象
	 *
	 *
	 * Test:
	 * var foo1 = [1, [2, 3], [4, 5, [6, 7, [8]]], [9], 10];
	 * stretchArr(foo1);
	 *
	 * 
	 * Expect:
	 * ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
	 * 
	 * 
	 * PS: 拉伸后的数组元素为String
	 */
	function stretchArr(arr){
		if(!Array.isArray(arr)) console.error("请传入一个数组");
		return arr.join(",").split(",");
	}


	/**筛选数据，用于echarts数据可视化
	 * @param target obj/arr 需要进行筛选的目标对象
	 * @param field str 需要提取的字段名称
	 * @return Array 返回一个包含需要字段信息的数组
	 *
	 *
	 * Test:
	 * var target = [{count:123},{count:3452},[{a:0,count:8909}]]
	 * filterData(target,count);
	 *
	 * 
	 * Expect:
	 * [123,3452,8909]
	 *
	 *
	 * PC: 此方法编写目的是用于Echarts所需data数据的提取
	 */
	function filterData(target,field,arr){
	    "use strict";
	    var arr = (typeof arr === "array") ? arr : [];
	    if(typeof field !== "string")console.error("传入_pickUpData函数的参数不合法");
	    if(arguments.length < 2)console.error("至少传入_pickUpData函数两个参数");
	    if(Array.isArray(target)){	// isArray
	        target.forEach(function(item,index){
	           if(typeof item === 'object')Array.prototype.push.apply(arr,filterData(item,field,arr));
	        });
	    }else if(typeof target === "object"){	// isObject
	    	if(Array.isArray(target[field])){
	    		if (typeof extend === 'function') {
	    			arr.push(...extend(target[field], true));	// just for ES6
	    		}
	    		else{
	    			throw new Error('Can\'t find function: \'extend\'');
	    		}
	    	}
	        else if(typeof target[field] !== "undefined"){	
	        	arr.push(target[field]);	// if has found, just push it in target array
	        }
	        else{
	        	for(var key in target){		// Otherwise, the recursive loop is executed
	        		Array.prototype.push.apply(arr,filterData(target[key],field,arr))
	        	}
	        }
	    }else{
	        return;
	    }
	    return arr;
	}



	/**
	 * 数组去空【空字符串 null undefined】
	 * @param arr Array 需要处理的原始数组
	 * @return Array 处理后的数组对象 
	 * 
	 */
	function arrayDeleteEmpty(arr) {
		let clean = []
		let target = 'null undefined'

		for (let i = 0, len = arr.length; i < len; i++) {
			let item = arr[i]
			let type = typeOf(item)
			if (type === 'string' && empty(item) || target.indexOf(type) >= 0)
				continue
			clean.push(item)
		}
		return clean
	}



	/**筛选数组中最大数，自己写的一套，可以用原生 Math.max(a,b,c,d)代替
	 * @param arr Array 需要进行筛选的目标数组
	 * @return Array 返回该数组中的最大数
	 */
	function arrayMax(arr){
		// 暂不做ES5以下浏览器的兼容
		if(typeof Array.prototype.reduce === "undefined") return "low end Browser";

		// ES5的归并方法
		return arr.reduce((prev,cur,i,arr)=>{
			prev = parseFloat(prev),
			cur = parseFloat(cur);
			if(cur > prev){
				return cur;
			}else{
				return prev;
			}
		});
	}


	/**筛选数组中最小数，自己写的一套，可以用原生 Math.min(a,b,c,d)代替
	 * @param arr Array 需要进行筛选的目标数组
	 * @return Array 返回该数组中的最小数
	 */
	function arrayMin(arr){
		// 暂不做ES5以下浏览器的兼容
		if(typeof Array.prototype.reduce === "undefined") return "low end Browser";

		// ES5的归并方法
		return arr.reduce((prev,cur,i,arr)=>{
			prev = parseFloat(prev),
			cur = parseFloat(cur);
			if(cur < prev){
				return cur;
			}else{
				return prev;
			}
		});
	}


	/**
	 * 数组扩展方法，用于找到第一个符合条件的数组成员。
	 * @param  {Function} 执行筛选的回调函数
	 * @return {Object}   筛选出来的对象
	 *
	 *
	 * Test:
	 * [1,2,3,4,5,-10,20,120,-8].find((item, index, arr) => { return item < 0 })
	 *
	 *
	 * Expect:
	 * -10
	 * 
	 */
	(() => {
		// 支持ES6原生find方法就用原生
		if (Array.prototype.find) return;

		// 这块注意不能写成箭头函数形式
		// 由于箭头函数没有自己的this，如果写成箭头函数，this直接指向window
		Array.prototype.find = function(callBack) {
			for (let i = 0; i < this.length; i++) {
				if (callBack(this[i], i, this)) return this[i] 
			}
		}

	})()



	/**
	 * 数组扩展方法，用于找到第一个符合条件的数组成员的索引。
	 * @param  {Function} 执行筛选的回调函数
	 * @return {Number}   对应项的索引
	 *
	 *
	 * Test:
	 * [1,2,3,4,5,-10,20,120,-8].findIndex((item, index, arr) => { return item < 0 })
	 *
	 *
	 * Expect:
	 * 5
	 * 
	 */
	(() => {
		// 支持ES6原生findIndex方法就用原生
		if (Array.prototype.findIndex) return;

		// 这块注意不能写成箭头函数形式
		// 由于箭头函数没有自己的this，如果写成箭头函数，this直接指向window
		Array.prototype.findIndex = function(callBack) {
			for (let i = 0; i < this.length; i++) {
				if (callBack(this[i], i, this)) return i
			}
		}

	})()



	/**
	 * 数组扩展方法，用于检测数组中是否包含某个元素
	 * @param  {All}     target 需要检测的包含对象
	 * @return {Boolean} 布尔值，表示是否包含该对象
	 */
	(() => {
		if (Array.prototype.includes) return
		Array.prototype.includes = function(target) {
			for (let i = 0; i < this.length; i++) {
				// 注意这块要全等，因为原生的includes也是全等操作
				if (this[i] === target) return true
			}
			return false
		} 
	})()

















/* 时间操作函数 ------------------------------------------------------------------------------------- */
  	
  	/**
	 * 格式化时间戳函数
	 * @param fmt 转换模式
	 * @return 转换后的时间字符串 
	 *
	 * 
	 * Test1:
	 * var time1 = new Date().format("yyyy-MM-dd hh:mm:ss");
	 *
	 * Expect1:
	 * "2018-01-16 13:29:00"
	 *
	 *
	 *
	 *
	 * Test2:
	 * var time2 = new Date().format("yyyyMMddhhmmss");
	 *
	 * Expect2:
	 * "20180116132849"
	 *
	 * 
	 */
	Date.prototype.format = function(fmt) { 
		var o = { 
			"M+" : this.getMonth()+1,                 //月份 
			"d+" : this.getDate(),                    //日 
			"h+" : this.getHours(),                   //小时 
			"m+" : this.getMinutes(),                 //分 
			"s+" : this.getSeconds(),                 //秒 
			"q+" : Math.floor((this.getMonth()+3)/3), //季度 
			"S"  : this.getMilliseconds()             //毫秒 
		}; 
		if(/(y+)/.test(fmt)) {
			fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		}
		for(var k in o) {
			if(new RegExp("("+ k +")").test(fmt)){
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
			}
		}
		return fmt; 
	}


	/**
	 * 获取 1970/1/1 午夜距离该日期时间的秒数/毫秒数
	 * @param second    {Boolean} 返回秒/毫秒数 【true : 秒 , false : 毫秒 , 默认返回秒】
	 * @returns {number}
	 */
	function getParseDate(second=true) {
	    return second ? Date.parse(new Date()) / 1000 : Date.parse(new Date())
	}

























/* 数字操作 ------------------------------------------------------------------------------------------------------------------------------------- */

	/**
	 * 数学运算保留精度
	 * 
	 * floatTool 包含加减乘除四个方法，能确保浮点数运算不丢失精度
	 *
	 * 我们知道计算机编程语言里浮点数计算会存在精度丢失问题（或称舍入误差），其根本原因是二进制和实现位数限制有些数无法有限表示
	 * 以下是十进制小数对应的二进制表示
	 *      0.1 >> 0.0001 1001 1001 1001…（1001无限循环）
	 *      0.2 >> 0.0011 0011 0011 0011…（0011无限循环）
	 * 计算机里每种数据类型的存储是一个有限宽度，比如 JavaScript 使用 64 位存储数字类型，因此超出的会舍去。舍去的部分就是精度丢失的部分。
	 *
	 * ** method **
	 *  add / subtract / multiply /divide
	 *
	 * ** explame **
	 *  0.1 + 0.2 == 0.30000000000000004 （多了 0.00000000000004）
	 *  0.2 + 0.4 == 0.6000000000000001  （多了 0.0000000000001）
	 *  19.9 * 100 == 1989.9999999999998 （少了 0.0000000000002）
	 *
	 * floatObj.add(0.1, 0.2) >> 0.3
	 * floatObj.multiply(19.9, 100) >> 1990
	 *
	 */
	var floatTool = function() {

		/*
		 * 判断obj是否为一个整数
		 */
	    function isInteger(obj) {
	        return Math.floor(obj) === obj
	    }

		/*
		 * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
		 * @param floatNum {number} 小数
		 * @return {object}
		 *   {times:100, num: 314}
		 */
	    function toInteger(floatNum) {
	        var ret = {times: 1, num: 0}
	        if (isInteger(floatNum)) {
	            ret.num = floatNum
	            return ret
	        }
	        var strfi  = floatNum + ''
	        var dotPos = strfi.indexOf('.')
	        var len    = strfi.substr(dotPos+1).length
	        var times  = Math.pow(10, len)
	        var intNum = parseInt(floatNum * times + 0.5, 10)
	        ret.times  = times
	        ret.num    = intNum
	        return ret
	    }

		/*
		 * 核心方法，实现加减乘除运算，确保不丢失精度
		 * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
		 *
		 * @param a {number} 运算数1
		 * @param b {number} 运算数2
		 * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
		 * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
		 *
		 */
	    function operation(a, b, op) {
	        var o1 = toInteger(a)
	        var o2 = toInteger(b)
	        var n1 = o1.num
	        var n2 = o2.num
	        var t1 = o1.times
	        var t2 = o2.times
	        var max = t1 > t2 ? t1 : t2
	        var result = null
	        switch (op) {
	            case 'add':
	                if (t1 === t2) { // 两个小数位数相同
	                    result = n1 + n2
	                } else if (t1 > t2) { // o1 小数位 大于 o2
	                    result = n1 + n2 * (t1 / t2)
	                } else { // o1 小数位 小于 o2
	                    result = n1 * (t2 / t1) + n2
	                }
	                return result / max
	            case 'subtract':
	                if (t1 === t2) {
	                    result = n1 - n2
	                } else if (t1 > t2) {
	                    result = n1 - n2 * (t1 / t2)
	                } else {
	                    result = n1 * (t2 / t1) - n2
	                }
	                return result / max
	            case 'multiply':
	                result = (n1 * n2) / (t1 * t2)
	                return result
	            case 'divide':
	                return result = function() {
	                    var r1 = n1 / n2
	                    var r2 = t2 / t1
	                    return operation(r1, r2, 'multiply')
	                }()
	        }
	    }

	    // 加减乘除的四个接口
	    function add(a, b) {
	        return operation(a, b, 'add')
	    }
	    function subtract(a, b) {
	        return operation(a, b, 'subtract')
	    }
	    function multiply(a, b) {
	        return operation(a, b, 'multiply')
	    }
	    function divide(a, b) {
	        return operation(a, b, 'divide')
	    }

	    // exports
	    return {
	        add: add,
	        subtract: subtract,
	        multiply: multiply,
	        divide: divide
	    }
	}();



	/**
	 * 范围随机数
	 * @param min Number 最小数字
	 * @param max Number 最大数字
	 * @return Array 返回拉伸后的数组对象 
	 * 
	 */
	function randomNum(Min, Max) {
		var Range = Math.abs(Max - Min);
		var Rand = Math.random();
		var num = Min + Math.round(Rand * Range); //四舍五入
		return num;
	}


























/* 字符串操作 ---------------------------------------------------------------------------------------------------------- */
	/**
	 * 首字母大写
	 * @param str {string} 需要处理的字符串
	 * @return {String} 处理后的字符串
	 */
	function firstUpperCase(str) {
		let string = str.toString();
		return string[0].toUpperCase() + string.slice(1);
	}


	/**
	 * 指定长度的随机字符串
	 * @param len {Number} 需要生成的随机字符串长度
	 * @return {String}    生成的随机字符串
	 */
	function random_string(len) {
	　　len = len || 32;
	　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
	　　var maxPos = chars.length;
	　　var pwd = '';
	　　for (i = 0; i < len; i++) {
	    　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	    }
	    return pwd;
	}

















/* 文件操作 ---------------------------------------------------------------------------------------------------------- */

	/**
	 * 获取文件后缀
	 * @param filename    {String}  文件名
	 * @param separator   {Boolean} 是否要分隔符，默认不需要
	 * @returns {string}
	 */
	function get_suffix(filename, separator=false) {
	    let pos = separator ? filename.lastIndexOf('.') : filename.lastIndexOf('.') + 1,
	        suffix = ''
	    if (pos != -1) {
	        suffix = filename.substring(pos)
	    }
	    return suffix
	}























/* DOM 操作 ---------------------------------------------------------------------------------------------------------- */
	
	/*
	 * 判断元素是否有某个className
	 * @param el {object} 目标元素
	 * @param className {string} 需要检测的className
	 * @return Boolean 
	 */
	function hasClass (el, className) {
		var reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
		return reg.test(el.className)
	}


	/*
	 * 为选定的元素添加className
	 * @param el {object} 目标元素
	 * @param className {string} 需要添加的className
	 * @return Null 
	 */
	function addClass (el, className) {
		if (hasClass(el, className)) return;
		var newClass = el.className.split(' ');
		newClass.push(className);
		el.className = newClass.join(' ');
	}


	/*
	 * 为选定的元素删除className
	 * @param el {object} 目标元素
	 * @param className {string} 需要删除的className
	 * @return Null
	 */
	function removeClass (el, className) {
		if (!hasClass(el, className)) return;
		var classArr = el.className.split(' ');
		classArr.forEach(function (item, index, arr) {
			if (item === className) {
				arr.splice(index, 1);
			}
		});
		var newClassName = classArr.join(' ');
		el.className = newClassName;
	}


	/*
	 * 获取元素相对页面的offset
	 * @param el {object} 目标元素
	 * @return object 包括offsetLeft和offsetTop
	 */
	function getOffset (el) {
		var x = 0,
			y = 0,
			parent = null;
		while (parent = el.offsetParent) {
			x += el.offsetLeft;
			y += el.offsetTop;
			el = p;
		}
		return {
			x: x,
			y: y
		}
	}


	/**
	 * 获取 data- 开头的自定义属性
	 * @param  {Object} el   要获取属性的原生DOM元素
	 * @param  {String} name 要获取的属性名
	 * @param  {String} val  要设置的属性值
	 * @return {String}      获取到的属性值【设置值无返回】
	 */
	function getData(el, name, val) {
		let prefix = 'data-';
		name = prefix + name;
		if (val) {
			el.setAttribute(name, val)
		}else{
			return el.getAttribute(name)
		}
	}






















/* 光标操作 ---------------------------------------------------------------------------------------------------------- */

	/**
	 * 获取光标位置
	 * @param  {Object} textDom   要获取光标位置的DOM元素
	 * @return {Number} cursorPos 光标位置
	 */
	function getCursorPosition (textDom) {
	    var cursorPos = 0;
	    if (document.selection) {
	        // IE Support
	        textDom.focus ();
	        var selectRange = document.selection.createRange();
	        selectRange.moveStart ('character', -textDom.value.length);
	        cursorPos = selectRange.text.length;
	    }else if (textDom.selectionStart || textDom.selectionStart == '0') {
	        // Firefox support
	        cursorPos = textDom.selectionStart;
	    }
	    return cursorPos;
	}



	/**
	 * 设置光标位置
	 * @param  {Object} textDom   要设置光标位置的DOM元素
	 * @param  {Number} pos  	  要设置光标的位置
	 */
	function setCursorPosition(textDom, pos){
	    if(textDom.setSelectionRange) {
	        // IE Support
	        textDom.focus();
	        textDom.setSelectionRange(pos, pos);
	    }else if (textDom.createTextRange) {
	        // Firefox support
	        var range = textDom.createTextRange();
	        range.collapse(true);
	        range.moveEnd('character', pos);
	        range.moveStart('character', pos);
	        range.select();
	    }
	}


	/**
	 * 获取选中文本
	 * @return {tString} text 选中的文本
	 */
	function getSelectText() {
	    var userSelection, text;
	    if (window.getSelection) {
	        // Firefox support
	        userSelection = window.getSelection();
	    } else if (document.selection) {
	        // IE Support
	        userSelection = document.selection.createRange();
	    }
	    if (!(text = userSelection.text)) {
	        text = userSelection;
	    }
	    return text;
	}



	
	/**
	 * 选中特定范围的文本
	 * @param  {Object} textDom   DOM元素
	 * @param  {Number} startPos  起始位置
	 * @param  {Number} endPos    终点位置
	 */
	function setSelectText(textDom, startPos, endPos) {
	    var startPos = parseInt(startPos),
	        endPos = parseInt(endPos),
	        textLength = textDom.value.length;
	    if(textLength){
	        if(!startPos){
	            startPos = 0;
	        }
	        if(!endPos){
	            endPos = textLength;
	        }
	        if(startPos > textLength){
	            startPos = textLength;
	        }
	        if(endPos > textLength){
	            endPos = textLength;
	        }
	        if(startPos < 0){
	            startPos = textLength + startPos;
	        }
	        if(endPos < 0){
	            endPos = textLength + endPos;
	        }
	        if(textDom.createTextRange){
	            // IE Support
	            var range = textDom.createTextRange();
	            range.moveStart("character",-textLength);
	            range.moveEnd("character",-textLength);
	            range.moveStart("character", startPos);
	            range.moveEnd("character",endPos);
	            range.select();
	        }else{
	            // Firefox support
	            textDom.setSelectionRange(startPos, endPos);
	            textDom.focus();
	        }
	    }
	}



	/**
	 * 在光标后插入文本
	 * @param  {Object} textDom   被插的DOM元素
	 * @param  {String} value     插入的内容
	 */
	function insertAfterText(textDom, value) {
	    var selectRange;
	    if (document.selection) {
	        // IE Support
	        textDom.focus();
	        selectRange = document.selection.createRange();
	        selectRange.text = value;
	        textDom.focus();
	    }else if (textDom.selectionStart || textDom.selectionStart == '0') {
	        // Firefox support
	        var startPos = textDom.selectionStart;
	        var endPos = textDom.selectionEnd;
	        var scrollTop = textDom.scrollTop;
	        textDom.value = textDom.value.substring(0, startPos) + value + textDom.value.substring(endPos, textDom.value.length);
	        textDom.focus();
	        textDom.selectionStart = startPos + value.length;
	        textDom.selectionEnd = startPos + value.length;
	        textDom.scrollTop = scrollTop;
	    }
	    else {
	        textDom.value += value;
	        textDom.focus();
	    }
	}





