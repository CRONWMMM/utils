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
import { REGLIST } from 'reglist'
// tips
import { TIPS } from 'tips'


const NICKNAME = 'VA'


class schema {
	constructor(rules) {
		this.rules = rules
		this.NICKNAME = NICKNAME
		this.TIPS = TIPS
	}

	// 验证器
	validate(data, fn) {
		let errors = [],
			fields = {}
		// validation failed, errors is an array of all errors
    	// fields is an object keyed by field name with an array of
    	// errors per field
		fn(errors, fields)
	}

	// 遍历器
	_iterator(data={}) {
		if (!isArray(data)) this._notice(TIPS.TARGET_TYPE_ERR)
		let rules = this.rules,
			currentRule = null
		for (let k in data) {
			currentRule = rules[k]
			if (!currentRule) continue
			if (!isArray(currentRule)) this._notice(TIPS.RULES_TYPE_ERR, k)
		}
	}
	
	// 系统提示
	_notice(message, field) {
		if (isUndefined(field)) 
			console.error(`[${this.NICKNAME}-warn]:${message}`)
		else
			console.error(`[${this.NICKNAME}-warn]:${field}${message}`)
	}
}

