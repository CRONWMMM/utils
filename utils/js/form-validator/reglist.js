

// 正则表
export const REGLIST = {
	ImgCode: /^[a-zA-Z0-9]{4}$/,
	SmsCode: /^\d{4}$/,
	MailCode: /^\d{4}$/,
	UserName: /^[\w|\d]{4,16}$/,
	Password: /^[\w!@#$%^&*.]{6,16}$/,
	Mobile: /^1[3|4|5|7|8]\d{9}$/,
	RealName: /^[\u4E00-\u9FA5\uf900-\ufa2d\w]{4,16}$/,
	// RealName: /^[\u4e00-\u9fa5|·]{2,16}$|^[a-zA-Z|\s]{2,20}$/,
	BankNum: /^\d{10,19}$/,
	Money: /^([1-9]\d*|[0-9]\d*\.\d{1,2}|0)$/,
	Answer: /^\S+$/,
	Mail: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
}