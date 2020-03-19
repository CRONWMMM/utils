<template>
	<div class="my-own-mask" :style="extendStyle" @click="handleClickMask"></div>
</template>

<script>
	export default {
		props: {
			show: Boolean,
			styles: { // 扩展样式
				type: Object,
				default: function() {
					return {};
				}
			},
			animate: { // 使用动画
				type: Boolean,
				default: true
			},
			closeOnClickMask: { // 是否允许点击蒙层关闭蒙层
				type: Boolean,
				default: true
			},
			time: { // 动画时间单位毫秒
				type: Number,
				default: 300
			},
		},
		data() {
			return {
				flag: true,
				opacity: 0,
				visible: this.show
			};
		},
		computed: {
			extendStyle() {
				let result = {
					...this.styles,
					opacity: this.opacity,
					'pointer-events': this.opacity === 0 ? 'none' : 'auto'
				};
				if (this.animate) result.transition = `opacity ${this.time/1000}s ease`;
				return result;
			}
		},
		methods: {
			handleClickMask() {
				if (this.closeOnClickMask) {
					this.visible = false;
				}
			}
		},
		watch: {
			show(val) {
				if (val) this.opacity = 1;
				else this.opacity = 0;
				this.visible = val;
			},
			visible(val) {
				this.$emit('toggle', val);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my-own-mask {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 99;
		background-color: rgba(0, 0, 0, 0.6);
	}
</style>
