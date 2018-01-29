/**
 *
 * 配置文件
 *
 */
export const BASIC_CONFIG = {       // ------------------------------------------------------------------------------------- 基础配置
    g_sub_dirname: 'CRM',                                           // 上传到权限目录的子目录名称，不填默认上传根目录
    g_object_name_type: 'random_name',                              // 文件名类型【 保持本地文件名字 (local_name) / 随机文件名 (random_name) 】
    random_name_length: 15                                          // 随机文件名长度，默认15个字符串【 当 g_object_name_type 字段设置为 local_name 时该属性不生效】
}


export const UPLOADER_CONFIG = {    // ------------------------------------------------------------------------------------- 实例化 plupload.Uploader 时基础参数
    runtimes: 'html5,flash,silverlight,html4',                      // 支持的传输方式
    browse_button: 'selectfiles',                                   // html页面上，选择文件按钮的id名
    multi_selection: true,                                          // 多文件上传【 true / false 】
    flash_swf_url : './lib/plupload-2.1.2/js/Moxie.swf',            // swf文件，当需要使用swf方式进行上传时需要配置该参数
    silverlight_xap_url : './lib/plupload-2.1.2/js/Moxie.xap',      // silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
    url: 'http://oss.aliyuncs.com',                                 // 服务器端的上传页面地址
}

export const FILTER_CONFIG = {      // ------------------------------------------------------------------------------------- 实例化 plupload.Uploader 时传入的过滤配置项
    filters: {
        mime_types: [                                               // 允许上传的文件类型
            { title : "Image files", extensions : "jpg,gif,png,bmp" },
            { title : "Zip files", extensions : "zip,rar" }
        ],
        max_file_size: '10mb',                                      // 上传文件的最大大小，默认10mb
        prevent_duplicates: true,                                   // 阻止选取重复文件
    }
}

export const TIPS = {               // ------------------------------------------------------------------------------------- 错误提示文本
    exceededSize: '选择的文件太大了',
    formatError: '请选择正确的文件类型',
    duplicates: '这个文件已经上传过了',
}
