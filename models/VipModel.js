module.exports = function(db,callback){
	// 客户模型
	db.define("VipModel",{
		user_id : {type: 'serial', key: true},
		username : String,
    qq_open_id: String,
		password : String,
		user_email : String,
		// user_email_code : Number,
		is_active : ['是','否'],
		user_sex : ['男','女'],
		user_qq : String,
		user_tel : String,
		user_xueli : ['博士','硕士','本科','专科','高中','初中','小学'],
		user_hobby : String,
		user_introduce : Number,
		create_time : Number,
		update_time : Number,
		role_id: Number
	},{
		table : "sp_user"
	});
	return callback();
}