

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


export { typeOf, isNumber, isString, isFunction, isArray, isObject }
