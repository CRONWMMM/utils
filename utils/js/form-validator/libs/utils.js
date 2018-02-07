

'use strict'


// 类型检测
function typeOf(obj){
	const toString = Object.prototype.toString
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
	}
	return map[toString.call(obj)]
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





// 对象深度查找
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


export { typeOf, isNumber, isString, isFunction, isArray, isObject }
