<!-- 图钉组件 -->
<template>
    <div ref="affix">
        <!-- 图钉点 -->
        <div ref="point" :style="style" class="affix-point">
            <slot></slot>
        </div>
        <!-- 占位插槽 -->
        <div v-show="slot" :style="slotStyle"></div>
    </div>
</template>

<script>
    // utils
    import { getOffsetToParentNode } from 'common/js/utils'

    export default {
        props: {
            offsetTop: { // 距离顶部的固定位置
                type: Number,
                default: 0
            },
            zIndex: { // zindex
                type: Number,
                default: 20
            },
            initParentElement: { // 初始化函数，外部传入，返回一个 DOMElement 作为参考的滚动父元素
                type: Function
            }
        },
        mounted () {
            // 延迟二十秒，等待页面布局完成，在进行相关初始化
            setTimeout(() => {
                this.initEl()
                this.initEvt()
                this.initElSize()
                this.cacheStartPosition()
            }, 20)
        },
        data () {
            return {
                startPosition: null,
                scrollTop: 0,
                slotStyle: {},
                floating: false // 当前图钉的是否出于浮动状态
            }
        },
        computed: {
            style () {
                // 如果读取不到初始 top 就 return
                if (this.startPosition == null) return
                const startTop = this.startPosition.top
                const offsetTop = this.offsetTop
                const zIndex = this.zIndex
                if (this.scrollTop >= startTop - offsetTop) {
                    if (offsetTop > startTop) {
                        this.floating = false
                    } else {
                        this.floating = true
                    }
                    const top = this.parentElRelativeToPagePosition.top + offsetTop
                    return Object.assign({
                        position: 'fixed',
                        top: `${top}px`,
                        zIndex
                    }, this.slotStyle)
                } else {
                    this.floating = false
                    return {}
                }
            },
            slot () {
                return this.floating
            }
        },
        methods: {
            // 相关元素初始化
            initEl () {
                this.el = this.$refs.point
                if (this.initParentElement != null)
                    this.parentEl = this.initParentElement()
                else
                    this.parentEl = this.$refs.affix.offsetParent
            },

            // 初始化图钉元素的位置
            initElSize () {
                const el = this.el
                this.slotStyle = {
                    width: `${el.clientWidth}px`,
                    height: `${el.clientHeight}px`
                }
            },

            // 缓存初始位置
            cacheStartPosition () {
                this.startPosition = getOffsetToParentNode(this.el, this.parentEl)
                this.parentElRelativeToPagePosition = getOffsetToParentNode(this.parentEl)
            },

            // 初始化事件
            initEvt () {
                const self = this
                const parentEl = this.parentEl
                parentEl.addEventListener('scroll', function (e) {
                    self.scrollTop = parentEl.scrollTop
                }, false)
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "~common/sass/variables";
    @import "~common/sass/mixin";

    /* variables */

    .affix-point {
        min-width: 0px;
        min-height: 0px;
    }

</style>