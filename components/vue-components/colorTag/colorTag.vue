<template>
    <div class="color-tag-component">
		<span class="color-tag-label" v-if="showLabel">
			<span class="absolute-full label-border" :style="{borderColor: color}"></span>
			<span class="absolute-full label-background" :style="{backgroundColor: color}"></span>
			<span class="label-text" :style="{color}">{{label}}</span>
		</span>
        <span class="color-tag-value" :class="extendClassName(index, values.length)" v-show="showValues" v-for="(value, index) in values" :key="index">
			<span class="absolute-full value-border" :style="{borderColor: color}"></span>
			<span class="absolute-full value-background"></span>
			<span class="value-text" :style="{color}">{{value}}</span>
			<i v-show="closeable" class="kc-icon-close" @click="handleClose(index, value)"></i>
		</span>
        <span class="color-tag-value" :class="extendClassName(0, 0)" v-show="showValue">
			<span class="absolute-full value-border" :style="{borderColor: color}"></span>
			<span class="absolute-full value-background"></span>
			<span class="value-text" :style="{color}">{{value}}</span>
			<i v-show="closeable" class="kc-icon-close" @click="handleClose(value)"></i>
		</span>
    </div>
</template>

<script>
  export default {
    props: {
      label: String, // 标签名
      value: String, // 标签值
      closeable: Boolean, // 是否可删
      values: Array, // 标签值列表
      color: {
        type: String,
        default: '#FB8253'
      }
    },
    data() {
      return {};
    },
    computed: {
      showLabel() {
        return  this.label != null && this.label !== '';
      },
      showValues() {
        return this.values != null && this.values.length > 0;
      },
      showValue() {
        return !this.showValues;
      },
      extendClassName() {
        return function (index, arrLen) {
          return [
            this.showLabel ? 'leftFillet' : 'leftAngle',
            this.showLabel && index === 0 ? 'noLeftBorder' : '',
            index < arrLen - 1 ? 'noRightBorder' : ''
          ];
        }
      }
    },
    methods: {
      handleClose(index, target) {
        const values = this.values;
        let result = null;
        if (typeof index === 'number') {
          result = {
            values,
            index,
            target
          };
        } else {
          target = index;
          result = {
            target
          };
        }
        this.$emit('close', result);
      }
    }
  }
</script>

<style lang="scss" scoped>
    .color-tag-component {
        $radius: 4px;
        $height: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        height: $height;
        line-height: $height;
        font-size: 0;
        & > * {
            display: inline-block;
            box-sizing: border-box;
            font-size: 14px;
        }
        .absolute-full {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
        }
        .label-border, .value-border {
            display: inline-block;
            border: 1px solid #FB8253;
        }
        .label-border { opacity: 0.5; }
        .value-border { opacity: 0.4; }
        .label-background, .value-background {
            display: inline-block;
            opacity: 0.15;
        }
        .label-background {
            background-color: #FB8253;
        }
        .value-background {
            // 	background-color: #fff;
        }
        .label-text, .value-text {
            display: inline-block;
            z-index: 1;
            color: #FB8253;
        }
        .color-tag-label {
            position: relative;
            padding: 0 6px;
            text-align: center;
            .label-border {
                border-top-left-radius: $radius;
                border-bottom-left-radius: $radius;
            }
        }
        .color-tag-value {
            position: relative;
            padding: 0 6px;
            text-align: center;
            .value-border {
                border-top-right-radius: $radius;
                border-bottom-right-radius: $radius;
            }
            .kc-icon-close {
                cursor: pointer;
            }
            &.leftFillet .value-border {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
            &.leftAngle .value-border {
                border-top-left-radius: $radius;
                border-bottom-left-radius: $radius;
            }
            &.noLeftBorder .value-border {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                border-left: none;
            }
            &.noRightBorder .value-border {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
                border-right: none;
            }
        }
    }
</style>
