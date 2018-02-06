/**
 * author: CRONWMMM
 * github: https://github.com/CRONWMMM
 * 
 * version: v0.0.1
 * date: 2018.1.9
 *
 * Just for ES6
 * 
 * o(￣ヘ￣o#) 哼！
 * 
 */


// utils
import { typeOf } from './libs/utils'
// reglist
import { REGLIST } from 'REGLIST'




// 断言
function assert(condition, message) {
	if (!condition) {
		console.error(`[${NICKNAME}-warn]:${message}`)
	} 
}


class schema {
	constructor(rules) {
		
	}

	validate(data, fn) {
		let errors = [],
			fields = {}
		// validation failed, errors is an array of all errors
    	// fields is an object keyed by field name with an array of
    	// errors per field
		fn(errors, fields)
	}
}

