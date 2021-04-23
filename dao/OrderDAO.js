var path = require("path");
daoModule = require("./DAO");
databaseModule = require(path.join(process.cwd(),"modules/database"));




module.exports.countByKey = function(key,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM sp_order";
	if(key) {
		sql += " WHERE user_id LIKE ?";
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


module.exports.findByKey = function(key,offset,limit,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM sp_order ";
  console.log(key)
	if(key) {
		sql += " WHERE user_id LIKE ? LIMIT ?,?";
		database.driver.execQuery(
			sql
		,[ key ,offset,limit],function(err,orders){
			if(err) return cb("查询执行出错");
			cb(null,orders);
		});
	} else {
		sql += " LIMIT ?,? ";
		database.driver.execQuery(sql,[offset,limit],function(err,orders){
			if(err) return cb(err);
			cb(null,orders);
		});
	}
}

module.exports.destroy = function(id,cb) {
	daoModule.destroy("OrderModel",id,function(err){
		if(err) return cb(err);
		return cb(null);
	});
}