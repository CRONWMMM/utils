/**
 * JS 设计模式
 * 
 * CRONWMMM
 * https://github.com/CRONWMMM
 * 
 * 
 * o(￣ヘ￣o#)
 * 
 */









/* 原型链继承 ----------------------------------------------------------------------- */

/**
 * 寄生式继承 继承原型
 * 这种方式实现的原型继承，在后续增强中不能再重新改写原型对象，否则失效
 * @param subClass {Function} 	子类
 * @param superClass {Function} 需要被继承的父类
 * @returns null 
 */
const inheritPrototype = ((subClass, superClass) => {

	// 寄生增强
	let p = inheritObject(superClass.prototype);
	p.constructor = subClass;
	subClass.prototype = p;


	/**
	 * 原型继承
	 * @param  {Object} o 父类实例
	 * @return {Object}   子类实例对象
	 *
	 * 通过这种方式实现原型链之间的继承
	 * 1. 避免了sub.prototype = sup.prototype这种形式下存在的引用缺陷
	 * 2. 避免了组合式继承的多次调用构造类的性能问题
	 */
	function inheritObject(o) {
		let F = function() {}
		F.prototype = o;
		return new F()
	}

})(subClass, superClass);












/* 工厂模式 ------------------------------------------------------------------------- */
/**
// 安全模式下的工厂方法
 * @param  {[type]} () [description]
 * @return {[type]}    [description]
 */
const Factory = (() => {

	// 安全模式，方式出现直接以函数调用形式使用类的情况
	const Factory = (type, content) => {
		if (this instanceof Factory) {
			new this[type](content);
		}
		else {
			new Factory(type, content)
		}
	};

	Factory.prototype = {
		constructor: Factory,
		type1(content) {
			this.content = content;
			// ... 
		},
		type2(content) {
			this.content = content;
			// ...
		}
		// ...
		
	}

})();


// 批量实例化
(() => {

	let data = [
		{ type: 'JavaScript', content: 'JavaScript很飘逸' },
		{ type: 'PHP', content: 'PHP是世界上最好的语言' },
		{ type: 'Java', content: '所以我选择Java' }
	]

	data.forEach(item => {
		Factory(item.type, item.content);
	});

})();































