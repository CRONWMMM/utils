<!-- Vue 2.0 【进度环组件】 -->
<template>
	<div class="progress-circle">
		<svg viewBox="0 0 100 100" :width="radius" :height="radius" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
			<circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" 
					:stroke-dashArray="dashArray"
					:stroke-dashoffset="dashOffset"></circle>
		</svg>
		<slot></slot>
	</div>
</template>

<script>
	export default {
		props: {
			// 圆环的尺寸，默认100
			radius: {
				type: Number,
				default: 100
			},
			// 百分比，0 ~ 1 小数表示
			percent: {
				type: Number,
				default: 1
			}
		},
		data() {
			return {
				dashArray: Math.PI * 100,
				dashOffset: (1 - this.percent) * dashArray
			}
		}
	}
</script>

<style scoped lang="scss">
	
	/*variables*/
	$color-theme-d: rgba(255, 205, 49, 0.5);
	$color-theme: #ffcd32;
	$stroke-width: 8px;

	.progress-circle{
		position: relative;
		circle{
			stroke-width: $stroke-width;
			transform-origin: center;
			&.progress-background{
				transform: scale(0.9);
				stroke: $color-theme-d;
			}
			&.progress-bar{
				transform: scale(0.9) rotate(-90deg);
				stroke: $color-theme;
			}
		}
	}

</style>