/**
 *
 * oss 前端上传文件
 * author: CRONWMMM
 * github: https://github.com/CRONWMMM
 * date: 2018/1/24
 *
 * 相关参考文档：
 * 1.https://www.cnblogs.com/2050/p/3913184.html
 * 2.https://help.aliyun.com/document_detail/31926.html
 *
 */
// libs
import 'common/js/oss/lib/plupload-2.1.2/js/plupload.full.min.js'
// utils
import { random_string, get_suffix, getParseDate } from 'common/js/utils'
// api
import {getOssSignature} from 'api/oss'
// flag
import {SUCCESS} from 'api/config'
// 配置文件
import { BASIC_CONFIG, UPLOADER_CONFIG, FILTER_CONFIG, TIPS } from './config'




// variables
let common = {      // ------------------------------------------------------------------------------------------------ 一些通用的全局变量，统一放在common中处理
        dir: '',                                                // 用于缓存请求后端签名接口后返回过来的权限目录
        subDir: BASIC_CONFIG.g_sub_dirname,                     // 在权限目录下创建的子目录，【config文件中配置】
        g_object_name_type: BASIC_CONFIG.g_object_name_type,    // 文件名是否采用随机字符串
        random_name_length: BASIC_CONFIG.random_name_length,    // 随机文件名字数
        expire: 0,                                              // 签名过期时间，用于判断是否需要重新请求签名接口
        now: getParseDate(),                                    // 当前时间，与签名过期时间配合使用，判断是否需要重新请求签名接口
    },
    params = {      // ------------------------------------------------------------------------------------------------ 需要发送给oss的参数子对象
        key: '',
        policy: '',
        OSSAccessKeyId: '',
        success_action_status: 200,
        callback: '',
        signature: ''
    },
    setOption = {   // ------------------------------------------------------------------------------------------------ 需要发送给oss的参数对象
        url: '',                                                // 用于接收后端接口返回过来的host，当然你知道的话也可以写死
        multipart_params: params                                // 对象引用，指向需要发送给oss的参数子对象
    }



/**
 * 生成发送给oss的一整套基础参数
 */
function get_params() {
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲，防止频繁请求
    let now = Date.parse(new Date()) / 1000,
        expire = common.expire
    Object.assign(common, { now })
    if (expire >= now + 3) return

    getOssSignature()
    .then(res => {
        let originData = res.data,
            result = originData.result,
            code = originData.stat.code,
            data = originData.data,
            normalizeData = null
        if (code === SUCCESS) {
            normalizeData = {
                policy: data.policy,
                OSSAccessKeyId: data.accessid,
                success_action_status: 200,
                signature: data.signature
            }
            Object.assign(params,normalizeData)
            Object.assign(common, { dir: data.dir, expire: data.expire })
            setOption.url = setOption.url === '' ? data.host : setOption.url.toString()
        }
        else {
            console.error('OSS获取签名出错，错误信息：', result)
        }
    }).catch(e => console.log(e))

}


/**
 * 扩展oss的上传参数，对上一步的基础参数对象作进一步处理
 * @param up
 * @param filename
 * @param ret
 */
function uploadOss(up, file) {
    // 这里_calculate_object_name函数用于扩展传给oss的参数，这些参数需要用户选择文件后才能获取
    _calculate_object_name(up, file)
    up.setOption(setOption);
    up.start();
}


/**
 * 私有方法，生成文件名 通过 g_object_name_type 类型判断是生成随机文件名还是本地文件名
 * @param up         uploader对象，用于重新生成新名称后发送事件
 * @param file       当前文件对象
 * @private
 */
function _calculate_object_name(up, file) {
    let filename = file && file.name || ''
    if (filename === '') return
    let g_object_name_type = common.g_object_name_type,
        g_object_name = '',
        random_name_length = common.random_name_length,
        dir = common.dir,
        subDir = common.subDir,
        suffix = ''

    if (g_object_name_type == 'local_name') {
        // 文件名含后缀
        g_object_name += `${filename}`
    }
    else if (g_object_name_type == 'random_name') {
        suffix = get_suffix(filename)
        g_object_name += `${random_string(random_name_length)}${suffix}`
    }
    g_object_name = `${dir}/${subDir}/${g_object_name}`
    // up.trigger('newUrl', { url: g_object_name })
    file.ossUrl = `${setOption.url}/${g_object_name}`
    file.suffix = suffix.substr(1)
    Object.assign(params, { key: g_object_name })
}

/**
 * 生成实例化 Uploader 时传入的 init 参数
 * @private
 */
function _init() {
    const init = {
        init: {
            /**
             * uploader上传出错时触发，注意，这个事件仅仅监听uploader对象抛出的错误
             * @param up
             * @param err
             * @constructor
             */
            Error(up, err) {
                let file = err.file,
                    code = err.code.toString(),
                    errData = null
                switch (code) {
                    case '-600':
                        errData = {
                            type: code,
                            file,
                            message: TIPS.exceededSize
                        }
                        break;
                    case '-601':
                        errData = {
                            type: code,
                            file,
                            message: TIPS.formatError
                        }
                        break;
                    case '-602':
                        errData = {
                            type: code,
                            file,
                            message: TIPS.duplicates
                        }
                        break;
                    default:
                        errData = {
                            file,
                            message: `Error: ${err.response}`
                        }
                        break;
                }
                up.trigger('Wrong', errData)
            }
        }
    }
    return init
}


/**
 * 这块要写成惰性生成的模式，需要的时候再new, 如果直接new plupload.Uploader有坑
 * @returns {module:plupload.Uploader|Uploader}
 */
function uploaderBuilder() {
    const INIT = _init(),
          options = Object.assign({}, UPLOADER_CONFIG, FILTER_CONFIG, INIT),
          uploader = new plupload.Uploader(options)
    return uploader
}

export { uploaderBuilder, get_params, uploadOss }