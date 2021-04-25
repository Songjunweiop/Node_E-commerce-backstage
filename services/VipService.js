var path = require("path");
var vipDAO = require(path.join(process.cwd(),"dao/VipDAO"));
var Password = require("node-php-password");
var logger = require('../modules/logger').logger();


/**
 * 获取所有会员
 * @param  {[type]}   conditions 查询条件
 * 查询条件统一规范
 * conditions
	{
		"query" : 关键词查询,
		"pagenum" : 页数,
		"pagesize" : 每页长度
	}
 * @param  {Function} cb         回调函数
 */
module.exports.getAllVips = function(conditions,cb) {

	
	if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");


	// 通过关键词获取会员数量
	vipDAO.countByKey(conditions["query"],function(err,count) {
		key = conditions["query"];
		console.log(key)
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);
		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if(offset >= count) {
			offset = count;
		}
		limit = pagesize;

		vipDAO.findByKey(key,offset,limit,function(err,vips){
			var retVips = [];
			for(idx in vips) {
				var vip = vips[idx];
				retVips.push({
					"id": vip.user_id,
					"username":vip.username,
					"create_time":vip.create_time,
					"mobile":vip.user_tel,
					"email":vip.user_email,
					"sex":vip.user_sex,
					"status":vip.is_active,
					"qq":vip.user_qq,
					"xueli":vip.user_xueli,
					"hobby":vip.user_hobby,
				});
			}
			var resultDta = {};
			resultDta["total"] = count;
			resultDta["pagenum"] = pagenum;
			resultDta["users"] = retVips;
			cb(err,resultDta);
		});
	});
}

module.exports.deleteVip = function(id,cb) {
	vipDAO.destroy(id,function(err){
		if(err) return cb("删除失败");
		cb(null);
	});
}

module.exports.getVip = function(id,cb) {
	vipDAO.show(id,function(err,vip){
		if(err) return cb(err);
		if(!vip) return cb("该会员不存在");
		cb(
			null,
			{
				"id": vip.user_id,
				"username":vip.username,
				"create_time":vip.create_time,
				"mobile":vip.user_tel,
				"email":vip.user_email,
				"sex":vip.user_sex,
				"status":vip.is_active,
				"qq":vip.user_qq,
				"xueli":vip.user_xueli,
				"hobby":vip.user_hobby,
			}
		);
	});
}

module.exports.updateVip = function(params,cb) {
	vipDAO.update(
		{
			"user_id": params.id,
			"user_tel":params.mobile,
			"user_email":params.email,
			"user_qq":params.qq,
		},
		function(err,vip) {
			if(err) return cb(err);
			cb(null,{
				"id": vip.user_id,
				"mobile":vip.user_tel,
				"email":vip.user_email,
				"qq":vip.user_qq,
			});
		}
	)
}


module.exports.login = function(username,password,cb) {
	logger.debug('login => username:%s,password:%s',username,password);
	logger.debug(username);
	vipDAO.findOne({"username":username},function(err,vip) {
		logger.debug(err);	
		if(err || !vip) return cb("用户名不存在");

		if(Password.verify(password, vip.password)){
			cb(
				null,
				{
					"id": vip.user_id,
					"username":vip.username,
					"create_time":vip.create_time,
					"mobile":vip.user_tel,
					"email":vip.user_email,
					"sex":vip.user_sex,
					"status":vip.is_active,
					"qq":vip.user_qq,
					"xueli":vip.user_xueli,
					"hobby":vip.user_hobby,
				}
			);
		} else {
			return cb("密码错误");
		}
	});
}

module.exports.createVip = function(params,cb) {
	// console.log(params)
	vipDAO.exists(params.username,function(err,isExists){
		// console.log(err)
		if(err) return cb(err);

		if(isExists) {
			return cb("用户名已存在");
		}

		vipDAO.create({
			"password":Password.hash(params.password),
			"username": params.username,
			"user_tel": params.mobile,
			"user_email": params.email,
			"user_sex": params.sex,
			"user_qq": params.qq,
			"user_xueli": params.xueli,
			"role_id": params.role_id,
			"create_time":(Date.parse(new Date())/1000),
			"update_time":(Date.parse(new Date())/1000),
		},function(err,vip){
			if(err) return cb(err);
			result = {
				"id": vip.user_id,
					"username":vip.username,
					"create_time":vip.create_time,
					"mobile":vip.user_tel,
					"email":vip.user_email,
					"sex":vip.user_sex,
					"status":vip.is_active,
					"qq":vip.user_qq,
					"xueli":vip.user_xueli,
			};
			cb(null,result);
		});
	});
}