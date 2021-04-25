var path = require("path");
daoModule = require("./DAO");
databaseModule = require(path.join(process.cwd(),"modules/database"));

/**
 * 创建管理员
 * 
 * @param  {[type]}   obj 管理员信息
 * @param  {Function} cb  回调函数
 */
module.exports.create = function(obj,cb) {
	console.log(obj)
	daoModule.create("VipModel",obj,cb);
}

/**
 * 获取管理员列表
 * 
 * @param  {[type]}   conditions 查询条件
 * @param  {Function} cb         回调函数
 */
module.exports.list = function(conditions,cb) {
	daoModule.list("VipModel",conditions,function(err,models) {
		if(err) return cb(err,null);
		cb(null,models);
	});
}

/**
 * 通过查询条件获取管理员对象
 * 
 * @param  {[type]}   conditions 条件
 * @param  {Function} cb         回调函数
 */
module.exports.findOne = function(conditions,cb) {
	daoModule.findOne("VipModel",conditions,cb);
}

/**
 * 通过关键词查询用户
 * 
 * @param  {[type]}   key    关键词
 * @param  {[type]}   offset 
 * @param  {[type]}   limit  
 * @param  {Function} cb     回调函数
 */
module.exports.findByKey = function(key,offset,limit,cb) {
	db = databaseModule.getDatabase();
	// sql = "SELECT * FROM sp_user as mgr LEFT JOIN sp_role as role ON mgr.role_id = role.role_id";
	sql = "SELECT * FROM sp_user ";

	if(key) {
		sql += " WHERE mg_name LIKE ? LIMIT ?,?";
		database.driver.execQuery(
			sql
		,["%" + key + "%",offset,limit],function(err,managers){
			if(err) return cb("查询执行出错");
			cb(null,managers);
		});
	} else {
		sql += " LIMIT ?,? ";
		database.driver.execQuery(sql,[offset,limit],function(err,managers){
			if(err) return cb("查询执行出错");
			cb(null,managers);
		});
	}
}

/**
 * 判断是否存在管理员
 * 
 * @param  {[type]}   username 用户名
 * @param  {Function} cb       回调函数
 * 
 */
module.exports.exists = function(username,cb) {
	var db = databaseModule.getDatabase();
	var Model = db.models.VipModel;
	Model.exists({"username":username},function(err,isExists){
		if(err) return cb("查询失败");
		 cb(null,isExists);
	});
}

/**
 * 模糊查询用户数量
 * 
 * @param  {[type]}   key 关键词
 * @param  {Function} cb  回调函数
 */
module.exports.countByKey = function(key,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM sp_user";
	if(key) {
		sql += " WHERE username LIKE ?";
		database.driver.execQuery(
			sql
		,["%" + key + "%"],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result[0]["count"]);
		});
	} else {
		database.driver.execQuery(sql,function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result[0]["count"]);
		});
	}
	
}

/**
 * 通过ID获取管理员对象数据
 * 
 * @param  {[type]}   id 管理员主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.show = function(id,cb) {
	daoModule.show("VipModel",id,cb);
}

/**
 * 更新管理员信息
 * 
 * @param  {[type]}   obj 管理员对象
 * @param  {Function} cb  回调函数
 */
module.exports.update = function(obj,cb) {
	daoModule.update("VipModel",obj.user_id,obj,cb);
}

/**
 * 删除管理员对象数据
 * 
 * @param  {[type]}   id 主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.destroy = function(id,cb) {
	daoModule.destroy("VipModel",id,function(err){
		if(err) return cb(err);
		return cb(null);
	});
}

/**
 * 保存管理员信息
 * 
 * @param  {[type]}   obj 管理员对象
 * @param  {Function} cb  回调函数
 */
module.exports.save = function(obj,cb) {
	daoModule.show(obj.mg_id,function(err,oldObj){
		if(err) {
			daoModule.create("VipModel",obj,cb);
		} else {
			daoModule.update("VipModel",obj.mg_id,obj,cb);
		}
	})
}

/**
 * 获取管理员数量
 * 
 * @param  {Function} cb 回调函数
 */
module.exports.count = function(cb) {
	daoModule("VipModel",cb);
}