// 验证邮箱
export function validateEmail(value){
    var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;      
    return !reg.test(value) ? true : false
}

// 过滤特殊字符
export function stripscript(value) {
    var pattern = new RegExp("[`~!@#$^&*%()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
    var rs = "";
        for (var i = 0; i < value.length; i++) {
            rs = rs + value.substr(i, 1).replace(pattern, '');
        }
    return rs;
}
    
