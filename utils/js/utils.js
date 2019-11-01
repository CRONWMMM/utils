
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



;((global, factory) => {

	"use strict"

	if (typeof module === 'object' && typeof module.exports === 'object') {

	    if (global.document) {
            return factory(global)
        } else {
            module.exports = (w) => {
                if (!w.document) {
                    throw new Error('This utils requires a window with a document')
                }
                return factory(w)
            }
        }

	} else {
		return factory(global)
	}

})(typeof window !== 'undefined' ? window : this, (window) => {


    'use strict';

    let U = null;

    U = {
        /* base 基础工具 ------------------------------------------------------------------------------------------------------------------------ */
        /**
         * 检测传入的参数类型
         * @param obj {All}	需要进行参数检测的对象
         * @return {String} 所属类型字符串
         */
        typeOf (obj) {
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
        },
        isNumber(obj) {
            return this.typeOf(obj) === 'number' && !isNaN(obj)
        },
        isNaN(obj) {
            return obj.toString() === 'NaN'
        },
        isString(obj) {
            return this.typeOf(obj) === 'string'
        },
        isFunction(obj) {
            return this.typeOf(obj) === 'function'
        },
        isArray(obj) {
            return this.typeOf(obj) === 'array'
        },
        isObject(obj) {
            return this.typeOf(obj) === 'object'
        },
        isUndefined(obj) {
            return this.typeOf(obj) === 'undefined'
        },

        /**
         * 自定义事件( 单例模式 )
         * event 对象工厂
         */
        EventFactory() {
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
        },


        /**
         * 自定义事件
         * event 对象工厂
         */
        class Emitter {
            constructor () {
                this.pool = {}
            }

            on (type, handler) {
                if (typeof handler !== 'function') return new Error('Emitter-error: Class Emitter 实例监听的必须是一个函数')
                type = type.toString()
                let handlerList = this.pool[type]
                handlerList == null && (handlerList = this.pool[type] = [])
                handlerList.push(handler)
            }

            off (type, handler) {
                type = type.toString()
                let handlerList = this.pool[type]
                if (handler == null) {
                    handlerList[type] = void (0)
                } else {
                    for (let i = 0, fn; i < handlerList.length; i++) {
                        fn = handlerList[i]
                        if (fn === handler) {
                            handlerList.splice(i, 1)
                            break
                        }
                    }
                }
            }

            trigger (type, data) {
                type = type.toString()
                let handlerList = this.pool[type]
                for (let i = 0, fn; i < handlerList.length; i++) {
                    fn = handlerList[i]
                    fn(data)
                }
            }
        }


        /**
         * 判空函数
         * @param  {obj/arr/str}  检测对象
         */
        empty(obj){
            const typeOf = this.typeOf
            if(typeOf(obj) === "object"){
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
            }else if(typeOf(obj) === "string"){	// string
                return !(obj.trim()).length>0
            }else{								// error
                throw new Error("empty函数接收的参数类型：对象、数组、字符串");
            }
        },

        /**
         * 辅助绑定函数
         * 原生bind方法是使用柯里化的方式实现的，这边只是简化模式
         * @param  {Function} fn  [description]
         * @param  {[type]}   obj [description]
         * @return {[type]}       [description]
         */
        bind(fn,obj){
            return function(){
                return fn.apply(obj,arguments);
            }
        },

        /**
         * 深拷贝函数
         * @param target {object} 需要拷贝的目标对象
         * @returns {object} 拷贝完成的新对象
         */
        deepCopy(target) {
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
        },

        /**
         * 对象深度查找
         * @param target Object 需要处理的原始对象
         * @param callback filter函数
         * @return Object 符合filter筛选条件的对应对象
         *
         * Test:

            var data = [
                {
                    id: 1,
                    family: '隔壁老王家'
                    lists: [
                        { id: 4, name: '老王老婆' },
                        { id: 5, name: '老王儿子' },
                        { id: 6, name: '老王儿媳' }
                    ]
                },
                {
                    id: 2,
                    family: '隔壁老李家'
                    lists: [
                        { id: 7, name: '老李小姨子' },
                        { id: 8, name: '老李老婆' }
                    ]
                }
            ]
            findDeeply(data, item => item.id === 7)

         *
         *
         *
         *
         * Expect:
         * { id: 7, name: '老李小姨子' }
         *
         */
        findDeeply(target, callback) {
            const flag = typeOf(target)
            let result
            if (flag === 'array') {
                for (let i = 0, item; item = target[i++];) {
                    result = findDeeply(item, callback)
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
        },

        /**
         * 对象深度查找【对象原型扩展】,和上面一个功能相同
         * 调用方式：data.findDeeply(Func)
         * @param target Object 需要处理的原始对象
         * @param callback filter函数
         * @return Object 符合filter筛选条件的对应对象
         *
         *
         * Tips:
         * 这种对象扩展的方式在使用框架的项目下可能有问题，例如在Vue和Angular1项目下会报错
         * 可以结合使用try catch
         *
         *
         */
        findDeeplyExtend() {
            Object.prototype.findDeeply = function(callback) {
                const typeOf = this.typeOf
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
        },

        /**
         * 列表深度查找
         * @param   {Object / Array}  target    筛选对象 / 数组
         * @param  {Function}         callback  过滤函数
         * @param  {Array}              arr     每次深层递归返回的结果数组，作为下次递归的初始数组传入
         * @returns {*}
         */
        findDeeplyList(target, callback, arr=[]) {
            const typeOf = this.typeOf
            const flag = typeOf(target)

            if (flag === 'array') {
                for (let i = 0; i < target.length; i++) {
                    findDeeplyList(target[i], callback, arr)
                }
            }
            else if (flag === 'object') {
                if (callback(target)) {
                    arr.push(target)
                }
                for (let k in target) {
                    findDeeplyList(target[k], callback, arr)
                }
            }
            return arr
        },

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
         * Tips:
         * 这种对象扩展的方式在使用框架的项目下可能有问题，例如在Vue和Angular1项目下会报错
         * 可以结合使用try catch
         *
         */
        findDeeplyListExtend() {
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
        },


        /**
        * 深层数组递归执行某一处理函数
        * @param target { All Type } 需要进行操作的数据对象
        * @param filterFunc { Function } 筛选函数，接受当前的对象作为参数，返回一个布尔值
        * @param callback { Function } 回调函数，接受当前的对象作为参数
        */
        function arrayDeeplyHandler(target, filterFunc, callback) {
            const flag = typeOf(target);
            // 首先判断筛选条件，是否调用 callback
            activeCallBack(target, callback);
            if (flag === 'array') {
                target.forEach(item => {
                    arrayDeeplyHandler(item, filterFunc, callback);
                });
            } else if (flag === 'object') {
                for (let k in target) {
                    arrayDeeplyHandler(target[k], filterFunc, callback);
                }
            }
            // 判断是否调用 callback
            function activeCallBack (target, callback) {
                const sign = filterFunc(target);
                // 满足筛选的条件，就执行 callback
                sign && typeOf(callback) === 'function' && callback(target);
            }
        }



        /* 原生方法兼容 -------------------------------------------------------------------------------------- */
        /**
         * 用函数柯里化模拟 ES5 原生bind方法实现
         * @return {[type]} [description]
         */
        bindMethodsExtend() {
            Function.prototype.bind = function (context) {
                let args = Array.prototype.slice.call(arguments, 1)
                return () => {
                    let finalArgs = args.concat([...arguments])
                    this.apply(context, finalArgs)
                }
            }
        },

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
        findMethodExtend() {
            // 支持ES6原生find方法就用原生
            if (Array.prototype.find) return;

            // 这块注意不能写成箭头函数形式
            // 由于箭头函数没有自己的this，如果写成箭头函数，this直接指向window
            Array.prototype.find = function(callBack) {
                for (let i = 0; i < this.length; i++) {
                    if (callBack(this[i], i, this)) return this[i]
                }
            }

        },

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
        findIndexMethodExtend() {
            // 支持ES6原生findIndex方法就用原生
            if (Array.prototype.findIndex) return;

            // 这块注意不能写成箭头函数形式
            // 由于箭头函数没有自己的this，如果写成箭头函数，this直接指向window
            Array.prototype.findIndex = function(callBack) {
                for (let i = 0; i < this.length; i++) {
                    if (callBack(this[i], i, this)) return i
                }
            }

        },

        /**
         * 数组扩展方法，用于检测数组中是否包含某个元素
         * @param  {All}     target 需要检测的包含对象
         * @return {Boolean} 布尔值，表示是否包含该对象
         */
        includesMethodExtend() {
            if (Array.prototype.includes) return
            Array.prototype.includes = function(target) {
                for (let i = 0; i < this.length; i++) {
                    // 注意这块要全等，因为原生的includes也是全等操作
                    if (this[i] === target) return true
                }
                return false
            }
        },

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
        dateFormatMethodExtend() {
            if (Date.prototype.format) return
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
        },


        /* 对象操作 -------------------------------------------------------------------------------------- */
        /**
         * 对象去空
         * @param target  需要处理的目标对象
         * @param keyList  指定操作的 keyString 组成的数组，非必传，如果传了这个参数，就不会再对别的空 Key 做处理
         * @returns {Object}  处理后的对象
         */
        deleteObjEmpty(target, keyList) {
            let ret = {}
            if (keyList == null) {
                for (let k in target) {
                    if (target[k] !== '' && target[k] != null) ret[k] = target[k]
                }
            } else {
                ret = Object.assign({}, target)
                keyList.forEach(k => {
                    if (ret[k] === '' || ret[k] == null) delete ret[k]
                })
            }
            return ret
        },

        /**
         * 筛选出目标对象里有的字段，目标对象里没有的字段剔除
         * @param target    {Object}  目标比对对象
         * @param obj       {Object}  处理对象
         * @returns         {Object}  处理完成后的对象
         */
        objKeyFilter(target, obj) {
            const keyList = Object.keys(target)
            let ret = {}
            keyList.forEach(k => {
                ret[k] = obj[k] != null ? obj[k] : ''
            })
            return ret
        },

        /**
         * 对象空属性用预制位字符串代替
         * @param obj           {Object}  处理对象
         * @param extendList    {Array}   存储 KeyString 的数组，用于检测额外属性，扩展 obj 对象
         * @param preform       {String}  预制位
         * @returns {{}}
         */
        objPreformReplace( obj = {}, extendList = [], preform = '--') {
            for (let k in obj) {
                // 如果 value 为空或为 Null / undefined，就用 preform 代替这个字段
                if (obj[k] === '' || obj[k] == null) obj[k] = preform
            }
            extendList.forEach(k => {
                if (obj[k] === '' || obj[k] == null) obj[k] = preform
            })
            return obj
        },

        /**
         * 从目标对象中筛选需要的属性键值对
         * @param target        {Object}  目标对象
         * @param keyList       {Array}   存储 KeyString 的数组，用于筛选键值对属性
         * @returns {{}}                  返回的筛选后的对象
         */
        objOnly(target, keyList) {
            let ret = {}
            keyList.forEach(key => {
                ret[key] = target[key]
            })
            return ret
        },



        /* 数组操作 -------------------------------------------------------------------------------------- */
        /**
         * 判断一个元素是否在目标对象中
         * @param target   待判断的元素
         * @param arr      目标对象
         * @param cb      【可选】回调函数，接受这个 target 在数组中的索引
         * @returns {boolean}
         */
        inArray(target, arr, cb) {
            for (let i = 0,item; i < arr.length; i++) {
                item = arr[i]
                if (target === item) {
                    cb && cb(i)
                    return true
                }
            }
            return false
        },

        /**
         * 数组去重，【ES5去重方式，ES6可以使用Set结构进行去重】
         * @param  {Array} arr 需要处理的数组
         * @return {Array}     处理完成后的数组
         */
        dedupe(arr) {
            if (Set) {
                return Array.from(new Set(arr))
            } else {
                let ret = []
                for (let i = 0, flag = true, item; item = arr[i++]; flag = true) {
                    loop:
                        for (let k = 0, unit; unit = ret[k++];) {
                            if (unit === item) {
                                flag = false
                                break loop
                            }
                        }
                    if (flag) ret.push(item)
                }
                return ret
            }
        },

        /**
         * 数组提取，不改变原数组
         * @param  {Array}  arr   需要进行操作的原始数组
         * @param  {Number} start 截取的初始位置
         * @param  {Number} num   需要截取的个数
         * @return {Array}        截取完成后返回的新数组
         *
         * Test:
         * [1,2,32,'sds','asd',90,'piis']
         *
         *
         */
        copypart(arr, start, num) {
            let ret = []
            if (typeof num === 'number') {
                ret = arr.slice(start, start + num)
            } else {
                ret = arr.slice(start)
            }
            return ret
        },

        /**
         * 数组随机排序
         * @param  {Array} arr 需要进行排序操作的数组
         * @return {Array}     排序完成后的新数组
         *
         * Test:
         * [1,2,32,'sds','asd',90,'piis']
         *
         *
         */
        randomSort(arr) {
            let ret = []

            while (arr.length > 0) {
                let random = ((min, max) => {
                        let range = Math.abs(max - min),
                            rand = Math.random(),
                            num = min + Math.round(rand * range)
                        return num
                    })(0, arr.length),
                    item = arr.splice(random, 1)
                ret.push(...item)
            }
            return ret
        },

        /**
         * 洗牌函数，和上面数组随机排序一样，上面是自己第一遍写的，比较繁琐，这个算法更秀
         * 方法就是遍历需要打乱的数组，然后从中随机抽取两个元素交换位置。
         * @param  {Array} arr 需要打乱的数组
         * @return {Array}     打乱后的数组
         */
        shuffle(arr) {

            let _arr = arr.slice()

            for (let i = 0, len = _arr.length; i < len; i++) {
                let j = getRandomInt(0, i),
                    t = _arr[i]
                console.log(j)
                _arr[i] = _arr[j]
                _arr[j] = t
            }

            return _arr

            // 随机范围整数【左右都开】
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (Math.abs(max - min) + 1) + min)
            }
        },

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
        sortByInitials(arr, key, flag) {
            return arr.sort(function (a, b) {
                let type = this.typeOf(key),
                    regStr = 'boolean undefined',
                    result = regStr.indexOf(type) >= 0,
                    isReverse = result ? !!key : !!flag,
                    prevVal = result ? a.toUpperCase() : a[key].toUpperCase(),
                    nextVal = result ? b.toUpperCase() : b[key].toUpperCase();
                return !isReverse ? prevVal.charCodeAt() - nextVal.charCodeAt() :
                    nextVal.charCodeAt() - prevVal.charCodeAt()
            })
        },

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
        stretchArr(arr){
            if(!Array.isArray(arr)) console.error("请传入一个数组");
            return arr.join(",").split(",");
        },

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
        filterData(target,field,arr) {
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
        },

        /**
         * 数组去空【空字符串 null undefined】
         * @param arr Array 需要处理的原始数组
         * @return Array 处理后的数组对象
         *
         */
        arrayDeleteEmpty(arr) {
            const typeOf = this.typeOf
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
        },

        /**
         * 引用比较，用于将两个数组结构的每一项两两比较，通过筛选函数筛选出双方符合条件的、第一次找到的一对索引
         * @param target1           数组1
         * @param target2           数组2
         * @param filter            筛选函数，接收两项，需要返回一个布尔值
         * @param cb                筛选函数返回true执行的回调函数，接收两个索引
         * @returns {Object/null}   装有一对索引的对象或者是null
         */
        refCompare(target1, target2, filter, cb) {
            for (let i = 0, item; i < target1.length; i++) {
                item = target1[i]
                for (let k = 0, part; k < target2.length; k++) {
                    part = target2[k]
                    if (filter(item, part)) cb && cb(i, k)
                }
            }
        },





        /* 字符串操作 ---------------------------------------------------------------------------------------------------------- */
        /**
         * 首字母大写
         * @param str {string} 需要处理的字符串
         * @return {String} 处理后的字符串
         */
        firstUpperCase(str) {
            let string = str.toString();
            return string[0].toUpperCase() + string.slice(1);
        },

        /**
         * 指定长度的随机字符串
         * @param len {Number} 需要生成的随机字符串长度
         * @return {String}    生成的随机字符串
         */
        random_string(len) {
            len = len || 32;
            var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            var maxPos = chars.length;
            var pwd = '';
            for (i = 0; i < len; i++) {
                pwd += chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },

        /**
         * 获取文件后缀
         * @param filename    {String}  文件名
         * @param separator   {Boolean} 是否要分隔符，默认不需要
         * @returns {string}
         */
        getSuffix(filename, separator=false) {
            let pos = separator ? filename.lastIndexOf('.') : filename.lastIndexOf('.') + 1,
                suffix = ''
            if (pos != -1) {
                // 截取后缀，并且去除非单词的后缀字符
                suffix = filename.substring(pos).replace(/\W/, '')
            }
            return suffix
        },


        /* 输入过滤 ---------------------------------------------------------------------------------------------------------- */
        /**
         * 数字输入过滤函数，写的比较繁琐，后面要优化
         * @param input         输入数据
         * @param fractionNum   需要保留的小数位数，可不传
         * @returns {String}    过滤完成后的数据
         */
        numberFilter(input,fractionNum) {
            var input = input.split('') || [],
                fractionNum = !isNaN(fractionNum-0) ? fractionNum : 0,    // 小数位数
                pointFlag = true,       // 是否能够输入小数点
                pointIndex,             // 小数点位置
                output = [];            // 输出数组
            input.forEach(function(value,key){
                if(!isNaN(value-0)){    // 输入的为数字
                    if(fractionNum){   // 允许小数情况
                        if(pointFlag){  // 能够输入小数
                            output.push(value);
                        }else{     // 已经输入过，不能再输入小数
                            if(key<=fractionNum+pointIndex){
                                output.push(value);
                            }
                        }
                    }else{  // 不允许小数
                        if(key == 0 && value==0){

                        }else{
                            output.push(value);
                        }
                    }
                }else if(value === '.'){    // 输入为'.'
                    if(pointFlag && fractionNum){
                        if(key === 0){
                            output.push('0','.');
                        }else if(key > 0){
                            output.push('.');
                        }
                        pointIndex = key;
                        pointFlag = false;
                    }
                }
            });
            output = output.join('');
            return output;

            /**
             * 判断NaN
             * @param target 需要进行检测的目标对象
             */
            function isNaN(target) {
                return target.toString() === 'NaN'
            }
        },

        // 数字四舍五入
        // num为传入的值，n为保留的小数位
        formatNumber (num, n = 0) {
            let result;
            num = Number(num);
            // 如果不是数字，直接 return false
            if (isNaN(num)) return false;

            // 是整数的情况
            if (num.toString().indexOf('.') < 0) {
                if (n) {
                    result = `${String(num)}.`;
                    for (let i = 0; i < n; i++) {
                        result += '0';
                    }
                } else {
                    result = num;
                }
                return result;
            }

            let f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂
            result = f.toString();
            let rs = result.indexOf('.');

            // 判定如果是整数，增加小数点再补0
            if (rs < 0) {
                rs = result.length;
                result += '.';
            }
            while (result.length <= rs + n) {
                result += '0';
            }
            return Number(result);
        },

        /**
         * 计算折扣函数，此函数属于业务工具函数，不具有通用性
         * @param originNum   折扣小数
         * @param x           保留位数【选传】
         * @returns {Sting}   处理完成后带 % 号的折扣字符串
         */
        calcDiscount(originNum, x) {
            let discString = originNum * 100 + '',
                list = discString.split('.'),
                disc
            if (list[0] === '100') {
                disc = '100%'
                return disc
            }
            if (list[1]) {
                list[1] = list[1].substr(0, Number(x) || 0)
                disc = list.join('.') + '%'
            } else {
                disc = list.join('') + '%'
            }
            return disc
        },

        /**
         * 数字单位转换 元/万元/亿元/万亿
         * @param num
         * @returns {{num: number, unit: string}}
         */
        unitConvert (num, unit = ["元", "万元", "亿元", "万亿"]) {
            let dividend = 10000
            let curentNum = num //转换数字
            let curentUnit = moneyUnits[0] //转换单位
            for (let i = 0; i < 4; i++) {
                curentUnit = moneyUnits[i]
                if(_strNumSize(curentNum) < 5) break;
                curentNum = curentNum / dividend
            }
            let m = {num: 0, unit: ""}
            m.num = curentNum.toFixed(2)
            m.unit = curentUnit

            return m

            function _strNumSize (tempNum) {
                var stringNum = tempNum.toString()
                var index = stringNum.indexOf(".")
                var newNum = stringNum
                if( index != -1 ) {
                    newNum = stringNum.substring(0,index)
                }
                return newNum.length
            }
        },



        /* 数字操作 ------------------------------------------------------------------------------------------------------------------------------------- */
        /**
         * 范围随机数
         * @param min Number 最小数字
         * @param max Number 最大数字
         * @return Number 	 生成的随机数
         *
         */
        randomNum(Min, Max) {
            let Range = Math.abs(Max - Min),
                Rand = Math.random(),
                num = Min + Math.round(Rand * Range); //四舍五入
            return num;
        },


        /**
         * 小数四舍五入
         * @param number        需要操作的数字
         * @param precision     需要保留小数位数，如果有的小数的话，默认不保留小数位
         * @returns {number}    返回的数
         */
        round (number, precision = 0) {
            return Math.round(+number + 'e' + precision) / Math.pow(10, precision);
            //same as:
            //return Number(Math.round(+number + 'e' + precision) + 'e-' + precision);
        },






        /* cookie 操作 ------------------------------------------------------------------------------------------------------------- */
        /**
         * 设置cookie/清除cookie
         * @param name {string}	设置的cookie名
         * @param value {string} 设置的cookie值
         * @param myDay {number} cookie存在的天数（设置为负值可清除cookie）
         */
        setCookie(name,value,myDay){
            var oDate=new Date();
            oDate.setDate(oDate.getDate()+myDay);
            document.cookie=name+'='+value+'; expires='+oDate;
        },
        /**
         * 获取cookie
         * @param name {string} 要获取的cookie名
         * @returns {string} 返回的cookie值
         */
        getCookie(name){
            //document.cookie获取当前网站的所有cookie
            var arr=document.cookie.split('; ');
            for(var i=0;i<arr.length;i++){
                var arr1=arr[i].split('=');
                if(arr1[0]==name){
                    return arr1[1];
                }
            }
            return '';
        },


        /* localStorage 操作 ----------------------------------------------------------------------------------------------------- */

        /**
         * 设置localStorage
         * @param key   {string} key
         * @param value {string} value
         */
        setStorage (key, value) {
            if (!window.localStorage)
                throw new Error('大兄弟，你的浏览器不支持localStorage');
            const typeOf = this.typeOf
            var storage = window.localStorage,
                key = typeOf(key) === 'string' ? key : key.toString(),
                value = typeOf(value) === 'string' ? value : JSON.stringify(value);
            storage.setItem(key, value);
        },

        /**
         * 获取localStorage
         * @param key   {string} key
         */
        getStorage (key) {
            if (!window.localStorage)
                throw new Error('大兄弟，你的浏览器不支持localStorage');
            const typeOf = this.typeOf
            var storage = window.localStorage,
                key = typeOf(key) === 'string' ? key : key.toString(),
                data = storage.getItem(key);
            return !!data ? JSON.parse(data) : null;
        },

        /**
         * 移除所有localStorage
         */
        removeAllStorage () {
            if (!window.localStorage)
                throw new Error('大兄弟，你的浏览器不支持localStorage');
            window.localStorage.clear();
        },

        /**
         * 移除单个localStorage
         * @param key   {string} key
         */
        removeStorage (key) {
            if (!window.localStorage)
                throw new Error('大兄弟，你的浏览器不支持localStorage');
            const typeOf = this.typeOf
            var storage = window.localStorage,
                key = typeOf(key) === 'string' ? key : key.toString();
            storage.removeItem(key);
        },








        /* userAgent 客户端检测 ------------------------------------------------------------------------------------------------------- */

        /**
         * 移动设备类型判断
         * @return {Object} 包含设备类型信息的对象
         */
        whichdevice() {
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
        },

        /**
         * 用户浏览器内核判断
         * @return {String / (Boolean)} 浏览器内核名称 (检测不到返回false)
         */
        clientJudge() {

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

        },





        /* Url 操作 ------------------------------------------------------------------------------------------------------------- */

        /**
         * 获取网页地址栏url的参数
         * @param name {string} url的key
         * @returns {string}
         */
        getUrlParam (name) {
            name = encodeURIComponent(name)
            const searchString = window.location.href.split('?').pop()
            let arr = new RegExp("(^|&)" + name + "=([^&]*)(&|$)").exec(searchString);
            if(arr){
                return RegExp.$2;
            }else{
                return '';
            }
        },



        /**
         * queryString和url进行拼接
         * @param data {object} 需要传递的键值对序列
         * @param encode {Boolean} 是否需要转义
         * @returns {string} 处理完毕的queryString
         *  类似：a=1&b=2&c=3
         */
        setUrlParam (data, encode = false) {
            let url = ''
            for (let k in data) {
                let value = data[k] !== undefined ? data[k] : ''
                encode && (value = encodeURIComponent(value))
                url += `${k}=${value}&`
            }
            return url ? url.slice(0, url.length - 1) : ''
        },


        /**
         * 以 key-value 的对象形式获取 queryString
         * @param {String}  需要检测的地址字符串
         * @returns {Object} queryString 的 key-value 对象
         */
        getUrlParamObj (str = window.location.href) {
            let ret = {}
            const searchString = str.split('?').pop()
            const keyValueArr = searchString.split('&')
            keyValueArr.forEach(item => {
                const arr = item.split('=')
                const key = arr[0]
                const value = arr[1]
                ret[key] = value
            })
            return this.deleteObjEmpty(ret)
        },


        /**
         * 判断一串url地址是否带有queryString
         * @param str           {String}  需要检测的地址字符串
         * @returns             {Boolean} 是否携带queryString
         *  类似：a=1&b=2&c=3
         */
        hasQueryString(str = window.location.href) {
            let reg = /\?/
            return reg.test(str)
        },














        /* 工具类函数 ----------------------------------------------------------------------------------------------------- */

        /**
         * 倒计时器
         *
         * 2018.3.19 创建
         *
         * 需求：
         * 1.可以创建多个互不干扰的独立倒计时器
         * 2.可以添加新的倒计时器
         * 3.可以删除某个倒计时器
         * 4.可以接收一个开始的时间戳
         * 5.任何独立的倒计时器每改变一次，就执行一次对应的回调函数
         * 6.单个倒计时结束/开始的时候派发事件，或者执行某个callback，并且能传递个性化参数
         *
         * 缺陷:
         * 1.这个写法等于创建了多个setTimeout，考虑到JS单线程的特性，倒计时器群会有略微的延迟，并不能保证绝对的准确
         * 2.如果这个时候一旦有阻塞操作，比如alert，倒计时也会一直被阻塞，直到进程空闲，所以我加上了reload方法，用来手动校准时间
         *
         */
        CountDown() {
            // 首先执行依赖检测，检测不到依赖函数就报错
            if (!_isFunc(this.timeStamp)) {
                throw new Error('Loss of dependence funtion: timeStamp');
                return ;
            }

            /*
             props: {
             el: 【DOM-element】,						// DOM元素
             initVal: 【Int】,							// 倒计时器初始值，持续的时间，毫秒
             start: 【Func】,							// 开始的回调函数
             finish: 【Func】,							// 结束的回调函数
             change: 【Func @params: oldTime, newTime】	// 状态改变的回调函数
             }
             */
            function _CountDown(props) {
                var self = this,													// ...
                    el = props.el || null,											// ...
                    initVal = !isNaN(props.initVal) ? props.initVal : 0,			// props里传入的初始值，毫秒
                    start = _isFunc(props.start) ? props.start : function() {},		// 倒计时器开始时的回调函数
                    finish = _isFunc(props.finish) ? props.finish : function() {},	// 倒计时器结束时的回调函数
                    change = _isFunc(props.change) ? props.change : function() {};	// 倒计时改变时的回调函数

                this.state = {
                    __flag__: false,		// 倒计时执行控制 flag
                    __timer__: null,		// timeout 存储句柄
                    _time: initVal			// 截止日期时间戳的初始值
                };
                this.props = props;			// props
                this.methods = {			// methods
                    start: start,
                    finish: finish,
                    change: change
                };

                Object.defineProperties(this.state, {
                    time: {
                        get: function() {
                            return this._time;
                        },
                        set: function(val) {
                            this._time = val;
                            el.innerText = timeStamp(val / 1000);
                        }
                    }
                });
            }

            // 倒计时器生命周期
            _CountDown.prototype = {
                begin: function() {					// 开始
                    this.state.__flag__ = true;
                    this.methods.start();
                    this.run();
                },
                run: function() {					// 执行中
                    var self = this;
                    if (!this.state.__flag__) return ;
                    this.state.__timer__ = setTimeout(function() {
                        var oldTime = self.state.time,
                            newTime = oldTime - 1000;
                        self.state.time = newTime;
                        if (self.state.time > 0) {
                            self.methods.change(oldTime, newTime);
                            self.run();
                        } else {
                            self.finish();
                            return ;
                        }
                    }, 1000);
                },
                pause: function() {},				// 暂停
                continue: function() {},			// 继续
                reload: function(val) {				// 倒计时重载，必要的时候用来校准时间
                    var props = this.props,
                        state = this.state;
                    state.__flag__ = true;
                    state._time = val;
                    props.el.innerText = timeStamp(val / 1000);
                    this.run();
                },
                finish: function() {				// 结束
                    this.state.__flag__ = false;
                    if (this.state.__timer__ != null) clearTimeout(this.state.__timer__);
                    this.state.time = 0;
                    this.methods.finish();
                },
                destroy: function() {				// 销毁
                    this.finish();
                    this.state = null;
                    this.props = null;
                }
            };

            // 函数判断
            function _isFunc(obj) {
                return typeof obj === 'function';
            }

            return _CountDown;

        },

        /**
         * 轮询函数 --- callback 模式
         * @param judgeFunc { Function }    判断函数，每次轮询通过这个判断函数执行结果，来判断是否完成轮询
         * @param callBack  { Function }    完成轮询执行的回调
         * @param interval  { Number }      轮询间隔
         * @param list      { like-array }  传入回调函数中的额外参数
         */
        polling(judgeFunc, callBack, interval = 10, ...list) {
            const flag = this.typeOf(judgeFunc) === 'function' && judgeFunc()
            if (flag) {
                callBack(...list)
            } else {
                setTimeout(() => {
                    this.polling(judgeFunc, callBack, interval, ...list)
                }, interval)
            }
        },

        /**
         * 节流器
         */
        Throttle: class {
            constructor(interval = 200) {
                this._timeoutId = null
                this._interval = interval
                this.funcPool = []
            }
            add(...funcList) {
                this.funcPool.push(...funcList)
            }

            remove(func) {
                this.funcPool = this.funcPool.filter(item => item !== func)
            }

            handle(...args) {
                const funcPool = this.funcPool
                if (this._timeoutId != null) clearTimeout(this._timeoutId)
                this._timeoutId = setTimeout(() => {
                    funcPool.forEach(func => {
                        func(...args)
                    })
                }, this._interval)
            }
        },

        /**
         * 判断是否用户是否是点击操作，还是选择文本
         * 业务场景，用户点击表格的某一行进入详情页面，但 click 事件是在 mouseup 时候触发的，用户有时只是想选择文本而已，却进了详情页，蛋疼的一批
         * @returns {Function}
         */
        judgeClickFactory () {
            const interval = 200 // 判断的时间间隔，默认 200ms ，两次触发的时间差大于 200ms 则判断用户不是单击操作
            let count = 1       // 计数，0 - 第一次点击，1 - 第二次点击
            let startTime = 0   // 记录第一次触发的时间
            let time = 0        // 计时器句柄
            return function () {
                let diff
                count = (count + 1) % 2
                // mousedown 时候开始计时
                if (count === 0) {
                    startTime = new Date().getTime()
                    // 超时重置
                    if (time) clearTimeout(time)
                    time = setTimeout(() => {
                        count = 1
                        startTime = 0
                    }, interval)
                    return false
                }

                // mouseup 时候计算时间差，判断是否是 click 操作
                diff = new Date().getTime() - startTime
                if (diff > interval) {
                    return false
                } else {
                    return true
                }
            }
        },

        /**
         * 向前补零函数【播放器时长计算等】
         * @param  {Number} num 需要处理的数字
         * @param  {Number} n   需要补的位数
         * @return {String}     处理完成后的字符串
         */
        padForward(num, n = 2) {
            let len = num.toString().length
            while (len < n) {
                num = '0' + num
            }
            return num
        },

        /**
         * 循环计数算法
         * @param  {Number} num 传入的目标数
         * @param  {Number} max 循环最大限定次数
         * @return {Number}     循环的下一个数
         *
         * 这个不需要当做一个函数来使用，但是写在这里的原因就是为了记录一个简单的循环计数的算法
         * 比如我想要切换游戏人物跑动的三种状态：慢走、快走、奔跑，这个时候这个小算法就很有用：
         *
         *
         * // 0 ----------- 慢走
         * // 1 ----------- 快走
         * // 2 ----------- 奔跑
         * let num = 0
         *
         * // 切换事件触发：
         * num = (num + 1) % 3
         *
         */
        loopCount(num, max) {
            num = Number(num)
            max = Number(max)
            return (num + 1) % max
        },

        /**
         * cavas图片压缩
         * @param  {[type]}   file     [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        imgResize(file,callback) {
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
        },

        /**
         * 获取图片原始尺寸信息
         * @param image 图片对象
         * @returns {Promise<any>}
         * @private
         */
        getImageOriginSize (image) {
            const src = typeof image === 'object' ? image.src : image;

            return new Promise((resolve, reject) => {
                const self = this;
                const image = new Image();

                image.onload = function () {
                    const { width, height } = image;
                    resolve({
                        width,
                        height
                    });
                };
                image.onerror = function (e) {
                    reject(e);
                };
                image.src = src;
            });
        },

        /**
         * 文件转换为 base64
         * @param  {File} file 图片文件
         * @return {Promise}
         */
        getBase64 (file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        },

        /**
         * base64转换二进制
         * @param  {[type]}   base64   [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        convertBlob(base64, callback) {
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
        },

        /**
         * 批量预加载图片函数，没试过，可能有Bug
         * @param IMGArr Array 需要预加载的图片地址
         * @param CBEvery Func 每次完成后的回调函数
         * @param CBFinal Func 全部完成后的回调函数
         * @return null
         *
         */
        preloadIMG(IMGArr,CBEvery,CBFinal) {
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
            CBFinal();
        },

        /**
         * Promise 加载单张图片
         * @param  {String}  path 需要加载的目标图片路径
         * @return {Promise}      Promise
         */
        preloadImage(path) {
            return new Promise((resolve, reject) => {
                const image = new Image()
                image.onload = () => {
                    resolve(this)
                }
                image.onerror = () => {
                    reject(new Error('图片加载失败'))
                }
                image.src = path
            })
        },

        /**
         * downLoadFile          下载网络资源文件
         * @param  {String}  url 资源文件地址
         */
        downloadFile(url) {
            const suffixList = [ 'jpg', 'jpeg', 'png', 'gif' ]
            let iframe = document.getElementById('iframeReportImg'),
                list = url.split('.'),
                length = list.length,
                urlSuffix = '',
                isImgFile = false,
                aElement = document.createElement('a')
            if (length === 0) return console.error('downloadFile 文件下载函数传入的资源地址不合法')
            urlSuffix = list[length - 1].toLowerCase()

            for (let i = 0, len = suffixList.length, item; i < len; i++) {
                item = suffixList[i]
                if (item === String(urlSuffix)) {
                    isImgFile = true
                    break;
                }
            }

            // 如果是非图片类型文件
            if (!isImgFile)
                return window.location.href = url

            // 图片类型文件
            if (aElement.download != null) {    // 如果浏览器支持 a.download
                aElement.download = url
                aElement.href = url
                aElement.target = '_blank'
                document.body.appendChild(aElement)
                aElement.click()
                document.body.removeChild(aElement)
            } else {    // 否则
                _createIframe(url)
            }

            function _createIframe(imgSrc) {
                //如果隐藏的iframe不存在则创建
                if (iframe == null) {
                    iframe = document.createElement('iframe')
                    iframe.style.display = 'none'
                    iframe.width = 0
                    iframe.height = 0
                    iframe.id = 'iframeReportImg'
                    iframe.name="iframeReportImg"
                    iframe.src = 'about:blank'
                    document.body.appendChild(iframe)
                    iframe.addEventListener('load', _downloadImg, false)
                }
                //iframe的src属性如不指向图片地址,则手动修改,加载图片
                if (String(iframe.src) != imgSrc) {
                    iframe.src = imgSrc
                } else {
                    //如指向图片地址,直接调用下载方法
                    _downloadImg()
                }
            }
            //下载图片的函数
            function _downloadImg() {
                //iframe的src属性不为空,调用execCommand(),保存图片
                if (iframe.src != "about:blank") {
                    window.frames["iframeReportImg"].document.execCommand("SaveAs");
                }
            }
        },

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
        floatTool: (() => {

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
        })(),





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
        AutoPage(size) {
            let size = (size - 0).toString() !== 'NaN' ? size : 640;
            // console.log(document.documentElement.clientWidth);
            document.documentElement.style.fontSize = document.documentElement.clientWidth * 100 / size + 'px';
        },

        /**
         * JS动态添加行内样式前缀
         * @return {String} 处理过的样式名称
         */
        prefixStyle(style) {
            if (typeof this.clientJudge === 'undefined') console.error('还没判断浏览器类型，调用个鸡儿的prefixStyle方法啊 (╯°Д°)╯︵ ┻━┻')
            if (this.clientJudge === false) {
                console.error(`你的浏览器不支持 ${style} 属性`)
            }
            else if (this.clientJudge === 'standard') {
                return style
            }
            else {
                // JS里的样式属性名需要写成驼峰
                return this.clientJudge + style.charAt(0).toUpperCase() + style.substr(1)
            }
        },





        /* 时间操作 ------------------------------------------------------------------------------------------------------------------------------------- */
        /**
         * 秒转换成天/时/分/秒
         * @param   second_time  {Number} 返回秒数
         * @param   acc  		 {String} 保留精度(和timeStamp内部对应的单位)
         * @returns 		     {String}
         */
        timeStamp(second_time, acc) {
            let config = {
                    sec: '秒',
                    min: '分',
                    hour: '小时',
                    day: '天'
                },
                divisor = {		// 除数，用作取余操作
                    sec: 1,
                    min: 60,
                    hour: 3600,
                    day: 43200
                },
                secondNum = parseInt(second_time),		// 总秒数
                timeStr = secondNum + config.sec,		// 最后返回的时间字符串
                limit = -1,
                sec,min,hour,day;						// 定义的变量
            sec = secondNum % divisor.min;
            if (secondNum >= divisor.min && secondNum < divisor.hour) {			// [1分钟, 1小时)
                min = parseInt(secondNum / divisor.min);
                timeStr = min + config.min + sec + config.sec;
            } else if (secondNum >= divisor.hour && secondNum < divisor.day) {		// [1小时, 1天)
                hour = parseInt(secondNum / divisor.hour);
                min = parseInt((secondNum - hour * divisor.hour) / divisor.min);
                timeStr = hour + config.hour + min + config.min + sec + config.sec;
            } else if (secondNum >= divisor.day) {									// [1天, Infinite天)
                day = parseInt(secondNum / divisor.day);
                hour = parseInt((secondNum - day * divisor.day) / divisor.hour);
                min = parseInt((secondNum - day * divisor.day - hour * divisor.hour) / divisor.min);
                timeStr = day + config.day + hour + config.hour + min + config.min + sec + config.sec;
            }

            limit = timeStr.indexOf(acc);
            if (limit >= 0) timeStr = timeStr.substring(0, limit + acc.length);

            return timeStr;
        },





        /* DOM 操作 ---------------------------------------------------------------------------------------------------------- */
        /*
         * 判断元素是否有某个className
         * @param el {object} 目标元素
         * @param className {string} 需要检测的className
         * @return Boolean
         */
        hasClass (el, className) {
            var reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
            return reg.test(el.className)
        },

        /*
         * 为选定的元素添加className
         * @param el {object} 目标元素
         * @param className {string} 需要添加的className
         * @return Null
         */
        addClass (el, className) {
            if (hasClass(el, className)) return;
            var newClass = el.className.split(' ');
            newClass.push(className);
            el.className = newClass.join(' ');
        },

        /*
         * 为选定的元素删除className
         * @param el {object} 目标元素
         * @param className {string} 需要删除的className
         * @return Null
         */
        removeClass (el, className) {
            if (!hasClass(el, className)) return;
            var classArr = el.className.split(' ');
            classArr.forEach(function (item, index, arr) {
                if (item === className) {
                    arr.splice(index, 1);
                }
            });
            var newClassName = classArr.join(' ');
            el.className = newClassName;
        },

        /*
         * 获取某个 DOM 元素相对页面的offset
         * @param el {object} 目标元素
         * @return object 包括offsetLeft和offsetTop
         * 几种元素尺寸/位置的获取方式，具体可见：http://www.ruanyifeng.com/blog/2009/09/find_element_s_position_using_javascript.html
         */
        getOffset (el) {
            const doc = document.documentElement
            const docClientWidth = doc.clientWidth
            const docClientHeight = doc.clientHeight
            let [ left, top, right, bottom, parent ] = [0, 0, 0, 0, el.offsetParent]

            // 如果当前浏览器原生支持 getBoundingClientRect 方法，就优先使用 getBoundingClientRect
            if (doc.getBoundingClientRect) {
                let positionInfo = el.getBoundingClientRect()
                left = positionInfo.left
                top = positionInfo.top
                right = docClientWidth - positionInfo.right
                bottom = docClientHeight - positionInfo.bottom
            } else {
                while (parent != null) {
                    left += el.offsetLeft
                    top += el.offsetTop
                    el = parent
                    parent = el.offsetParent
                }
                right = doc.offsetWidth - el.offsetWidth - left
                bottom = doc.offsetHeight - el.offsetHeight - top
            }

            return {
                left,
                top,
                right,
                bottom
            }
        }


        /*
         * 获取目标元素相对于目标祖先元素的位置
         * @param el {DOMobject}    目标（子）DOM元素
         * @param target {DOMobject} 目标DOM元素，不传默认为文档元素
         * @return object 包括 offsetLeft 和 offsetTop
         *
         */
        getOffsetToParentNode (el, target = document.documentElement) {
            if (!inTargetArea(el, target)) return null
            const targetClientRect = target.getBoundingClientRect()
            const elClientRect = el.getBoundingClientRect()
            const [ targetOffsetWidth, targetOffsetHeight ] = [ targetClientRect.width, targetClientRect.height ]
            const [ elOffsetWidth, elOffsetHeight ] = [ elClientRect.width, elClientRect.height ]
            let top = elClientRect.top - targetClientRect.top
            let left = elClientRect.left - targetClientRect.left
            let right = targetOffsetWidth - elOffsetWidth - left
            let bottom = targetOffsetHeight - elOffsetHeight - top
            return {
                top,
                left,
                right,
                bottom
            }
        },


        /*
         * 获取鼠标当前相对于某个元素的位置
         * @param e        {object}    原生事件对象
         * @param target {DOMobject} 目标DOM元素
         * @return object 包括offsetLeft和offsetTop
         *
         * Tips:
         * 1.offset 相关属性在 display: none 的元素上失效，为0
         * 2.offsetWidth/offsetHeight 包括border-width，clientWidth/clientHeight不包括border-width，只是可见区域而已
         * 3.offsetLeft/offsetTop 是从当前元素边框外缘开始算，一直到定位父元素的距离，clientLeft/clientTop其实就是border-width
         */
        getOffsetInElement (e, target) {
            let currentDOM = e.target || e.toElement
            if (!inTargetArea(currentDOM, target)) return null
            let left, top, right, bottom
            const { left: x, top: y } = getOffset(target)
            left = e.clientX - x
            top = e.clientY - y
            right = target.offsetWidth - left
            bottom = target.offsetHeight - top
            return { top, left, right, bottom }
        },

        /**
         * 判断一个DOM元素是否包裹在另一个DOM元素中【父子关系或者层级嵌套都可以】
         * @param  {Object} DOM         事件对象中的event.target/或者是需要检测的DOM元素
         * @param  {Object} targetDOM   作为限制范围的DOM元素
         * @return {Boolean}            true----是包裹关系，false----不是包裹关系
         */
        inTargetArea (DOM, targetDOM) {
            if (DOM === targetDOM) return true
            let parent = DOM.parentNode
            while (parent != null) {
                if (parent === targetDOM) return true
                DOM = parent
                parent = DOM.parentNode
            }
            return false
        },

        /**
         * 获取 data- 开头的自定义属性
         * @param  {Object} el   要获取属性的原生DOM元素
         * @param  {String} name 要获取的属性名
         * @param  {String} val  要设置的属性值
         * @return {String}      获取到的属性值【设置值无返回】
         */
        getData(el, name, val) {
            let prefix = 'data-';
            name = prefix + name;
            if (val) {
                el.setAttribute(name, val)
            }else{
                return el.getAttribute(name)
            }
        },

        /**
         * 脚本动态处理，动态插入或者动态卸载
         * @param src           {String}    需要加载脚本的 src 地址
         * @param options       {Object}    配置选项
         *          isLoad      {Boolean}   true 表示加载该脚本，false 表示卸载该脚本，默认为true
         *          callBack    {Function}  加载/卸载完成后的回调
         * @constructor
         */
        dynamicScript(src, options) {
            src = String(src)
            options = Object.assign({ isLoad: true }, options)
            const scriptDoms = document.getElementsByTagName('script')
            // 存储找到的 scriptDom 节点
            let targetScriptDom = null
            let { isLoad, callBack } = options
            // 是否存在匹配该 src 的 script
            let hasTargetScript = _checkRepet([...scriptDoms])
            let script = document.createElement('script')
            script.type = 'text/javascript'

            // 监听 onload 事件
            _EVTinit(script)

            // 如果不存在这个script，并且 isLoad 为 true 再插入
            if (!hasTargetScript && isLoad) {
                script.src = String(src)
                document.body.appendChild(script)

                // 如果存在这个script，并且 isLoad 为 false 则卸载
            } else if (hasTargetScript && !isLoad) {
                document.body.removeChild(targetScriptDom)
            }

            function _EVTinit(script) {
                script.onload = script.onreadystatechange = function() {
                    if(!this.readyState || this.readyState=='loaded' || this.readyState=='complete') {
                        callBack && callBack()
                    }
                }
            }

            function _checkRepet(domList) {
                let item = null, result = false
                for (let i = 0; i < domList.length; i++) {
                    item = domList[i]
                    if (item.src === src) {
                        targetScriptDom = domList[i]
                        result = true
                        break
                    }
                }
                return result
            }
        },


        DynamicScript: class extends this.Emitter {
            constructor (list = []) {
                super()
                this.loading = false // 正在加载的标识符，未完成之前不能加载别的脚本
                this.scriptsPool = {}
                this.loadPool = [] // 需要加载的脚本池
                this.unLoadPool = [] // 需要卸载的脚本池
                this.generatorScriptsPool(list)
            }

            // 根据传入的 list 生成对应的 Script DOM
            generatorScriptsPool(list) {
                const self = this
                let ret = {}
                let scriptDOM = null
                list.forEach(src => {
                    src = src.toString()
                    scriptDOM = this.scriptDOM = document.createElement('script')
                    scriptDOM.type = 'text/javascript'
                    scriptDOM.onload = scriptDOM.onreadystatechange = function (e) {
                        self.loading = false
                        if(!this.readyState || this.readyState=='loaded' || this.readyState=='complete') self._loadSuccess(e)
                    }
                    ret[src] = scriptDOM

                })
                this.scriptsPool = ret
            }

            // 获取当前页面已存在的脚本 DOM 列表
            getScriptsList() {
                return [...document.getElementsByTagName('script')]
            }

            // 加载
            load(param) {
                if (Array.isArray(param)) {
                    this.batchLoad(param)
                } else if (typeof param === 'string') {
                    this.singleLoad(param)
                } else {
                    throw new Error(`load 方法参数错误`)
                }
            }

            // 单源加载
            singleLoad(src) {
                src = src.toString()
                // 还有脚本正在加载，就 return
                if (this.loading) return false
                // 已经加载过了，return
                if (this.hasAdded(src)) return false
                const DOM = this.scriptsPool[src]
                if (!DOM) return false
                DOM.src = src
                document.body.appendChild(scriptDOM)
                this.loading = true
                return true
            }

            // 多源加载
            batchLoad(list) {

            }

            // 单源卸载
            unload (src) {
                this.getScriptsList().forEach(dom => {
                    if (dom.src === String(src)) {
                        document.body.removeChild(dom)
                    }
                })
            }

            // 检测传入的 src 是否已经加载到页面上
            hasAdded(src) {
                const existScriptsList = this.getScriptsList()
                let [ DOM, result ] = [ null, false ]
                for (let i = 0; i < existScriptsList.length; i++) {
                    DOM = existScriptsList[i]
                    if (DOM.src === String(src)) {
                        result = true
                        break
                    }
                }
                return result
            }

            _loadSuccess(e) {

            }

            // 工具函数，检测目标是否在给定数组内
            _inArray(target, arr, cb) {
                for (let i = 0,item; i < arr.length; i++) {
                    item = arr[i]
                    if (target === item) {
                        cb && cb(i)
                        return true
                    }
                }
                return false
            }
        }



        /* 光标操作 ---------------------------------------------------------------------------------------------------------- */
        /**
         * 获取光标位置
         * @param  {Object} textDom   要获取光标位置的DOM元素
         * @return {Number} cursorPos 光标位置
         */
        getCursorPosition (textDom) {
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
        },

        /**
         * 设置光标位置
         * @param  {Object} textDom   要设置光标位置的DOM元素
         * @param  {Number} pos  	  要设置光标的位置
         */
        setCursorPosition(textDom, pos){
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
        },

        /**
         * 获取选中文本
         * @return {tString} text 选中的文本
         */
        getSelectText() {
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
        },

        /**
         * 选中特定范围的文本
         * @param  {Object} textDom   DOM元素
         * @param  {Number} startPos  起始位置
         * @param  {Number} endPos    终点位置
         */
        setSelectText(textDom, startPos, endPos) {
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
        },

        /**
         * 在光标后插入文本
         * @param  {Object} textDom   被插的DOM元素
         * @param  {String} value     插入的内容
         */
        insertAfterText(textDom, value) {
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


    };


});
