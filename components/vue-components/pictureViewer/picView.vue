<template>
    <div class="picture-viewer-component"
         :id="id"
         :style="viewportStyle"
         @mouseleave="handleMouseLeave"
         @mousedown="handleMouseDown"
         @mousemove="handleMouseMove"
         @mouseup="handleMouseUp">
        <img v-show="validPic" :style="imageStyle" :src="imgSrc" :alt="imgAlt" draggable="false" />
        <div v-show="!validPic" class="no-picture"></div>
    </div>
</template>

<script>
	export default {
		props: {
			id: { // 组件唯一的标识 id
				type: [ Number, String ],
				default: 'viewport'
			},
			value: { // 图片地址
				type: String,
				default: ''
			},
			name: { // 图片名称
				type: [Number, String],
				default: '图片'
			},
			tip: { // 图片加载失败时的提示文本
				type: String,
				default: '图片加载失败'
			},
			width: { // viewport 视口的宽度
				type: [ Number, String ],
				default: '600px'
			},
			height: { // viewport 视口的高度
				type: [ Number, String ],
				default: '400px'
			},
			minimum: { // 缩放的最小尺寸【零点几】
				type: Number,
				default: 0.8
			},
			maximum: { // 缩放的最大尺寸
				type: Number,
				default: 8
			},
			rate: { // 缩放的速率
				type: Number,
				default: 10
			},
			center: { // 图片位置是否初始居中
				type: Boolean,
				default: true
			},
			contain: { // 图片尺寸是否初始包含在视口范围内
				type: Boolean,
				default: true
			}
		},
		data () {
			return {
				validPic: true, // 判断传入的图片是否是能够加载到的有效图片
				src: '',
				loadError: false, // 图片是否加载失败
				focus: false, // 鼠标是否按下，处于可拖动状态
				imageWidth: 0, // 图片宽度
				imageHeight: 0, // 图片高度
				startX: 0, // 鼠标按下时，距离 viewport 的初始 X 位置
				startY: 0, // 鼠标按下时，距离 viewport 的初始 Y 位置
				startLeft: 0, // 图片距离 viewport 的初始 Left
				startTop: 0, // 图片距离 viewport 的初始 Top
				currentLeft: 0, // 图片当前距离 viewport 的 left
				currentTop: 0, // 图片当前距离 viewport 的 top
				scale: 1 // 图片缩放比率 minimum - maximum
			};
		},
		created () {
			this.viewportDOM = null;
			this.imgDOM = null;
		},
		mounted () {
			this.viewportDOM = document.getElementById(this.id);
			this.imgDOM = this.viewportDOM.getElementsByTagName('img')[0];

			// 这边需要将滚轮事件使用原生绑定来处理
			// 从而解决新版本 chrome 浏览器带来的 passive event listener
			// 在对图片进行滚动缩放时无法使用 e.preventDefault 来禁用浏览器滚动问题
			this.imgDOM && this.imgDOM.addEventListener('wheel', this.handleMouseWheel, { passive: false });

			this.imgDOM && this.initPicture();
		},
		computed: {
			imgSrc () {
				return this.src || this.value;
			},
			// 图片的 alt 内容
			imgAlt () {
				return this.loadError ? this.tip : this.name;
			},
			viewportStyle () {
				const [ width, height ] = [ this.width, this.height ];
				return {
					width: isNaN(+width) ? width : `${width}px`,
					height: isNaN(+height) ? height : `${height}px`
				};
			},
			imageStyle () {
				const scale = this.scale;
				const currentLeft = this.currentLeft;
				const currentTop = this.currentTop;
				const currentImageWidth = scale * this.imageWidth;
				const currentImageHeight = scale * this.imageHeight;

				return {
					top: `${currentTop}px`,
					left: `${currentLeft}px`,
					width: `${currentImageWidth}px`,
					height: `${currentImageHeight}px`
				};
			}
		},
		methods: {
			/**
			 * 图片初始化，包括：
			 * 1. 初始图片位置居中
			 * 2. 记录初始图片尺寸
			 *
			 * tips：initPicture 函数内部需要获取外部视口 DOM 元素的信息，有些使用场景下
			 * 外部的视口元素可能先被隐藏，在适当的时候才会显示
			 * 由于原生 JS 没有提供 DOM 相关的监听策略，所以如果这一场景出现
			 * 那么会存在图片第一次宽高为零而不显示的情况
			 * 针对这一问题的解决方法是，递归调用 initPicture 直到发现视口元素存在为止
			 * 因此 initPicture 函数自身需要接受三个内部需要的参数
			 * 以避免代码运行时，向上查找作用域链导致的性能开销
			 */
			initPicture (viewportDOM, center, contain) {
				viewportDOM = viewportDOM || this.viewportDOM;
				center = center || this.viewportDOM;
				contain = contain || this.viewportDOM;
				const [ viewPortWidth, viewPortHeight ] = [ viewportDOM.clientWidth, viewportDOM.clientHeight ];
				const callback = this.center ? this.changeToCenter : this.changeToBasePoint;

				// 为了防止
				if (!viewPortWidth || !viewPortHeight) return setTimeout(this.initPicture, 200, viewportDOM, center, contain);

				// 这块有个执行顺序
				// 必须是先确定尺寸，再确定位置
				if (this.contain) {
					this.changeToContain(callback);
				} else {
					this.changeToOrigin(callback);
				}
			},

			/**
			 * 改变图片 src
			 */
			changeImage (src) {
				this.src = src;
			},

			/**
			 * 设置图片尺寸为 contain
			 */
			changeToContain (callback) {
				callback = isFunction(callback) ? callback : () => {};

				this._getImageOriginSize(this.imgSrc).then(({ width: imageOriginWidth, height: imageOriginHeight }) => {
					const { imageWidth, imageHeight } = this.reCalcImageSizeToContain(imageOriginWidth, imageOriginHeight);
					this.loadError = false;
					this.scale = 1;
					this.imageWidth = imageWidth;
					this.imageHeight = imageHeight;
					callback(imageWidth, imageHeight);
				}).catch(e => {
					console.error(e);
					this.loadError = true;
				});
			},

			/**
			 * 设置图片尺寸为原始尺寸
			 */
			changeToOrigin (callback) {
				callback = isFunction(callback) ? callback : () => {};

				this._getImageOriginSize(this.imgSrc).then(({ width: imageWidth, height: imageHeight }) => {
					this.loadError = false;
					this.scale = 1;
					this.imageWidth = imageWidth;
					this.imageHeight = imageHeight;
					callback(imageWidth, imageHeight);
				}).catch(e => {
					console.error(e);
					this.loadError = true;
				});
			},

			/**
			 * 设置图片位置为 center
			 */
			changeToCenter () {
				const viewportDOM = this.viewportDOM;
				const [ viewPortWidth, viewPortHeight ] = [ viewportDOM.clientWidth, viewportDOM.clientHeight ];
				// 设置图片默认位置居中
				const [ top, left ] = [ (viewPortHeight - this.imageHeight) / 2, (viewPortWidth - this.imageWidth) / 2 ];

				this.currentLeft = left;
				this.currentTop = top;
				this.startLeft = left;
				this.startTop = top;
			},

			/**
			 * 设置图片位置为基准点位置
			 * 基准点位置，基于视口: top: 0 && left: 0
			 */
			changeToBasePoint () {
				this.currentLeft = 0;
				this.currentTop = 0;
				this.startLeft = 0;
				this.startTop = 0;
			},

			/**
			 * 重新计算图片尺寸，使宽高都不会超过视口尺寸
			 * @param imageWidth
			 * @param imageHeight
			 * @returns {*}
			 */
			reCalcImageSizeToContain (imageWidth, imageHeight) {
				const rate = imageWidth / imageHeight;
				const viewportDOM = this.viewportDOM;
				const [ viewPortWidth, viewPortHeight ] = [ viewportDOM.clientWidth, viewportDOM.clientHeight ];
				if (imageWidth > viewPortWidth) {
					imageWidth = viewPortWidth;
					imageHeight = imageWidth / rate;
					return this.reCalcImageSizeToContain(imageWidth, imageHeight);
				} else if (imageHeight > viewPortHeight) {
					imageHeight = viewPortHeight;
					imageWidth = imageHeight * rate;
					return this.reCalcImageSizeToContain(imageWidth, imageHeight);
				} else {
					return { imageWidth, imageHeight };
				}
			},

			/**
			 * 处理鼠标按下
			 * @param e
			 */
			handleMouseDown (e) {
				const currentDOM = e.target || e.toElement;
				if (currentDOM !== this.imgDOM) return;

				let { top: startY, left: startX } = this._getOffsetInElement(e, this.viewportDOM);

				this.focus = true;
				this.startX = startX;
				this.startY = startY;
			},

			/**
			 * 处理鼠标移动
			 * @param e
			 */
			handleMouseMove (e) {
				const [ startTop, startLeft ] = [ this.startTop, this.startLeft ];
				if (!this.focus) return;

				let { left: currentX, top: currentY } = this._getOffsetInElement(e, this.viewportDOM);
				let [ diffX, diffY ] = [ currentX - this.startX, currentY - this.startY ];

				this.currentLeft = startLeft + diffX;
				this.currentTop = startTop + diffY;
			},

			/**
			 * 处理鼠标放开
			 */
			handleMouseUp () {
				this.focus = false;
				this.startX = 0;
				this.startY = 0;
				this.startLeft = this.currentLeft;
				this.startTop = this.currentTop;
			},

			/**
			 * 处理鼠标移出
			 */
			handleMouseLeave () {
				this.handleMouseUp();
			},

			/**
			 * 处理滚轮缩放
			 * @param e {Event Object} 事件对象
			 */
			handleMouseWheel (e) {
				const imgDOM = this.imgDOM;
				const [ minimum, maximum, rate ] = [ this.minimum, this.maximum, this.rate ];
				const [ originWidth, originHeight, currentLeft, currentTop, lastScale ] = [ this.imageWidth, this.imageHeight, this.currentLeft, this.currentTop, this.scale ];
				const [ imageWidth, imageHeight ] = [ imgDOM.clientWidth, imgDOM.clientHeight ];
				const event = e.nativeEvent || e;
				event.preventDefault();
				// 这块的 scale 每次都需要用 1 去加，作为图片的实时缩放比率
				let scale = 1 + event.wheelDelta / (12000 / rate);

				// 最小缩放至 minimum 就不能再缩小了
				// 最大放大至 maximum 倍就不能再放大了
				if ((lastScale <= minimum && scale < 1) || (lastScale >= maximum && scale > 1)) return;

				// 真实的图片缩放比率需要用尺寸相除
				let nextScale = imageWidth * scale / originWidth;

				// 进行缩放比率检测
				// 如果小于最小值，使用原始图片尺寸和最小缩放值
				// 如果大于最大值，使用最大图片尺寸和最大缩放值
				nextScale = nextScale <= minimum ? minimum : nextScale >= maximum ? maximum : nextScale;
				let currentImageWidth = nextScale * originWidth;
				let currentImageHeight = nextScale * originHeight;

				let { left, top } = this._getOffsetInElement(e, this.imgDOM);
				let rateX = left / imageWidth;
				let rateY = top / imageHeight;
				let newLeft = rateX * currentImageWidth;
				let newTop = rateY * currentImageHeight;


				this.scale = nextScale;
				this.startLeft = currentLeft + (left - newLeft);
				this.startTop = currentTop + (top - newTop);
				this.currentLeft = currentLeft + (left - newLeft);
				this.currentTop = currentTop + (top - newTop);
			},

			/**
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
			_getOffsetInElement (e, target) {
				let currentDOM = e.target || e.toElement;
				if (!this._inTargetArea(currentDOM, target)) return null;
				let left, top, right, bottom;
				const { left: x, top: y } = this._getOffset(target);
				left = e.clientX - x;
				top = e.clientY - y;
				right = target.offsetWidth - left;
				bottom = target.offsetHeight - top;
				return { top, left, right, bottom };
			},

			/**
			 * 判断一个DOM元素是否包裹在另一个DOM元素中【父子关系或者层级嵌套都可以】
			 * @param  {Object} DOM         事件对象中的event.target/或者是需要检测的DOM元素
			 * @param  {Object} targetDOM   作为限制范围的DOM元素
			 * @return {Boolean}            true----是包裹关系，false----不是包裹关系
			 */
			_inTargetArea (DOM, targetDOM) {
				if (DOM === targetDOM) return true;
				let parent = DOM.parentNode;
				while (parent != null) {
					if (parent === targetDOM) return true;
					DOM = parent;
					parent = DOM.parentNode;
				}
				return false;
			},

			/**
			 * 获取某个 DOM 元素相对视口的位置信息
			 * @param el {object} 目标元素
			 * @return object {object} 位置信息对象
			 */
			_getOffset (el) {
				const doc = document.documentElement;
				const docClientWidth = doc.clientWidth;
				const docClientHeight = doc.clientHeight;
				let positionInfo = el.getBoundingClientRect();
				return {
					left: positionInfo.left,
					top: positionInfo.top,
					right: docClientWidth - positionInfo.right,
					bottom: docClientHeight - positionInfo.bottom
				};
			},

			/**
			 * 获取图片原始尺寸信息
			 * @param image
			 * @returns {Promise<any>}
			 * @private
			 */
			_getImageOriginSize (image) {
				const src = typeof image === 'object' ? image.src : image;

				return new Promise((resolve, reject) => {
					const self = this;
					const image = new Image();

					image.onload = function () {
						self.validPic = true;
						const { width, height } = image;
						resolve({
							width,
							height
						});
					};
					image.onerror = function (e) {
						self.validPic = false;
						reject(e);
					};
					image.src = src;
				});
			}
		},
		watch: {
			width (val, oldVal) {
				val !== oldVal && this.initPicture();
			},
			height (val, oldVal) {
				val !== oldVal && this.initPicture();
			},
			value (val, oldVal) {
				if (val !== oldVal) {
					this.src = String(val);
				}
			},
			src (val, oldVal) {
				if (val !== oldVal) {
					this.$emit('input', val);
				}
			},
			imgSrc (val, oldVal) {
				if (val !== oldVal) {
					this.initPicture();
				}
			}
		}
	};

	/**
	 * 检测传入的参数类型
	 * @param obj {All}	需要进行参数检测的对象
	 * @return {String} 所属类型字符串
	 */
	function typeOf (obj) {
		const toString = Object.prototype.toString;
		const map = {
			'[object Boolean]': 'boolean',
			'[object Number]': 'number',
			'[object String]': 'string',
			'[object Function]': 'function',
			'[object Array]': 'array',
			'[object Date]': 'date',
			'[object RegExp]': 'regExp',
			'[object Undefined]': 'undefined',
			'[object Null]': 'null',
			'[object Object]': 'object'
		};
		return map[toString.call(obj)];
	}

	function isNaN (obj) {
		return obj.toString() === 'NaN';
	}

	function isFunction (obj) {
		return typeOf(obj) === 'function';
	}
</script>

<style scoped lang="scss">
    .picture-viewer-component {
        position: relative;
        display: block;
        margin: 0;
        padding: 0;
        overflow: hidden;
        img {
            cursor: move;
            position: absolute;
        }
        .no-picture {
            background-image: url('../../../assets/image/defaultImg.svg');
            background-repeat: no-repeat;
            background-size: 38%;
            background-position: center 33%;
            width: 100%;
            height: 100%;
        }
    }
</style>
