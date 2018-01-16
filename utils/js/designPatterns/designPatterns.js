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























