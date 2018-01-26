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












/* 简单工厂模式 ----------------------------------------------------------------------- */
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





/**
 * 抽象类介绍:
 * 以下创建的这个Car类什么都不能做，但在继承上却很有用处
 * 因为它定义了一种类，并定义了该类的一些必备方法
 * 如果在子类中没有重写这些必备方法，那么原型链查找就会访问父类的方法，从而报错
 * 这样父类给出一个友好的错误提示，那么对于忘记重写子类的这些错误遗漏的避免是有好处的
 * 这也是抽象类的一个作用，即定义一个产品簇，并声明一些必备的方法，如果子类中没有去重写就会报错
 * 
 * 
 */
(() => {
	const errorText = '抽象方法不能调用';
	const Car = () => {};

	Car.prototype = {
		getPrice() {return new Error(errorText);}，
		getSpeed() {return new Error(errorText);}
	};

})();




/**
 * 抽象工厂模式
 * 
 */
const VehicleFactory = (() => {

	const ERR_TEXT = '抽象方法不能调用'
	const VehicleFactory = (subType, superType) => {
		if (typeof VehicleFactory[superType] === 'function') {
			const F = () => {}
			F.prototype = new superType()
			subType.prototype = new F()
			subType.prototype.constructor = subType 
		}
		else {
			// 不存在该抽象类就抛出错误
			throw new Error('未创建该抽象类')
		}
	}


	// Car
	VehicleFactory.Car = () => {
		this.type = 'car'
	}

	VehicleFactory.Car.prototype = {
		getPrice() {
			return new Error(ERR_TEXT)
		},
		getSpeed() {
			return new Error(ERR_TEXT)
		}
	}




	// Bus
	VehicleFactory.Bus = () => {
		this.type = 'bus'
	}
	
	VehicleFactory.Bus.prototype = () => {
		getPrice() {
			return new Error(ERR_TEXT)
		},
		getSpeed() {
			return new Error(ERR_TEXT)
		}
	}




	// Truck
	VehicleFactory.Truck = () => {
		this.type = 'truck'
	}
	
	VehicleFactory.Truck.prototype = () => {
		getPrice() {
			return new Error(ERR_TEXT)
		},
		getSpeed() {
			return new Error(ERR_TEXT)
		}
	}

	return VehicleFactory

})()

// 宝马汽车类
let BMW = (price, speed) => {
	this.price = price;
	this.speed = speed;
}
VehicleFactory(BWM, 'Car')
BWM.prototype.getPrice = () => {
	return this.price
}
BWM.prototype.getSpeed = () => {
	return this.speed
}














/* 建造者模式：创建符合对象 ---------------------------------------------------------- */
const Human = (() => {
	const Human = function(params) {
		this.skill = params && params.skill || '保密'
		this.hobby = params && params.hobby || '保密'
	}
	Human.prototype = {
		constructor: Human,
		getSkill() {
			return this.skill
		},
		getHobby() {
			return this.hobby
		}
	}
	return Human
})()

const Named = (() => {
	const Named = function(name) {
		this.wholeName = name
		if (name.indexOf(' ') > -1) {
			let nameArr = name.split(' ')
			this.firstName = nameArr[0]
			this.lastName = nameArr[1]
		}
	}
	return Named
})()

const Work = (() => {
	const Work = function(work) {
		if (!(this instanceof Work)) {
			return new Work(work)
		}
		switch(work) {
			case 'code':
				this.work = '工程师',
				this.workDescript = '每天沉醉于编程'
				break
			case 'UI':
			case 'UE':
				this.work = '设计师',
				this.workDescript = '设计更似一种艺术'
				break
			case 'teach':
				this.work = '教师',
				this.workDescript = '分享也是一种快乐'
				break
			default:
				this.work = work
				this.workDescript = '暂无相关工作描述'
		}
	}	

	Work.prototype = {
		constructor: Work,
		changeWork(work) {
			this.work = work
		},
		workDescript(desc) {
			this.workDescript = desc
		}
	}

	return Work
})()


/**
 * 应聘建造者
 *
 */
const Person = function(name, work) {
	let _person = new Human()
	_person.name = new Named(name)
	_person.work = new Work(work)
	return _person
}

/*
	建造者模式总结：
	建造者模式不同于工厂模式，工厂模式注重于结果，创建的对象之间差别较小，无个性化定制。
	建造者关心的对象的创建过程，创建出来的对象粒度较细，创建类的每一个模块都能得到高度复用。

*/


/**
 * 惰性单例模式
 *
 */
let lazySingle = (() => {

	let _instance = null

	function Single() {
		return {
			a() {},
			b: 'PublicProperty'
		}
	}

	return function () {
		if (!_instance) {
			_instance = Single()
		}
		return _instance
	}

})()




/**
 * 函数柯里化
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
!function() {
	function curry(fn) {
		let args = Array.prototype.slice.call(arguments, 1)
		return function () {
			let finalArgs = args.concat([...arguments])
			return fn.apply(null, finalArgs) 
		}
	}

	function add(num1, num2) {
		return num1 + num2
	}

	curry(add, 1)(2)
}()



/**
 * 用函数柯里化模拟 ES5 原生bind方法实现
 * @return {[type]} [description]
 */
!function() {
	!function() {
		Function.prototype.bind = function (context) {
			let args = Array.prototype.slice.call(arguments, 1)
			return () => {
				let finalArgs = args.concat([...arguments])
				this.apply(context, finalArgs)
			}
		}	
	}()


	var a = {
		name: 'CRONWMMM'
	}

	function sayName() {
		alert(this.name)
	}

	sayName.bind(a)()
}



















