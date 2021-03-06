var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
var authorization = require(path.join(process.cwd(),"/modules/authorization"));

// 通过验证模块获取会员管理服务
var vipServ = authorization.getService("VipService");

// new test
// 查询会员列表
router.get("/",
	// 验证参数
	function(req,res,next) {
		// 参数验证
		if(!req.query.pagenum || req.query.pagenum <= 0) return res.sendResult(null,400,"pagenum 参数错误");
		if(!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null,400,"pagesize 参数错误"); 
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		console.log('ssssssssssssssssssssssssssssssssss')
		vipServ.getAllVips(
			{
				"query":req.query.query,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取会员列表成功");
			}
		)(req,res,next);
		
	}
);

// 删除会员信息
router.delete("/:id",
	// 验证参数
	function(req,res,next){
		if(!req.params.id) return res.sendResult(null,400,"会员ID不能为空");
		if(isNaN(parseInt(req.params.id))) return res.sendResult(null,400,"ID必须是数字");
		next();
	},
	// 处理业务逻辑
	function(req,res,next){
		vipServ.deleteVip(req.params.id,function(err){
			if(err) return res.sendResult(null,400,err);
			return res.sendResult(null,200,"删除成功");
		})(req,res,next);
	}
);

// 获取会员信息
router.get("/:id",
	// 参数验证
	function(req,res,next) {
		if(!req.params.id) {
			return res.sendResult(null,400,"会员ID不能为空");
		}
		if(isNaN(parseInt(req.params.id))) return res.sendResult(null,400,"会员ID必须是数字");
		next();
	},
	function(req,res,next) {
		vipServ.getVip(req.params.id,function(err,vip){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(vip,200,"获取成功");
		})(req,res,next);
	}
);

// 修改会员信息
router.put("/:id",
	// 参数验证
	function(req,res,next) {
		if(!req.params.id) {
			return res.sendResult(null,400,"会员ID不能为空");
		}
		if(isNaN(parseInt(req.params.id))) return res.sendResult(null,400,"会员ID必须是数字");
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		vipServ.updateVip(
			{
				"id":req.params.id,
				"mobile":req.body.mobile,
				"email":req.body.email,
				"qq": req.body.qq
			},
			function(err,vip) {
				if(err) return res.sendResult(null,400,err);
				res.sendResult(vip,200,"更新成功");
			}
		)(req,res,next);
	}
);

// 创建用户
router.post("/",
	// 验证参数
	function(req,res,next) {
		if(!req.body.username){
			return res.sendResult(null,400,"用户名不能为空");
		}
		if(!req.body.password) {
			return res.sendResult(null,400,"密码不能为空");
		}
		if(!req.body.rid) {
			req.body.rid = 30;
			//return res.sendResult(null,200,"角色ID不能为空");
		}
		if(isNaN(parseInt(req.body.rid))) req.body.rid = -1;//return res.sendResult(null,200,"角色ID必须是数字");
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		console.log(req.body)
		params = {
			"username":req.body.username,
			"password":req.body.password,
			// "create_time":req.body.create_time,
			"mobile":req.body.user_tel,
			"email":req.body.user_email,
			"sex":req.body.user_sex,
			"qq":req.body.user_qq || '',
			"xueli":req.body.user_xueli,
			"role_id": req.body.rid
		}
		vipServ.createVip(params,function(err,manager){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(manager,201,"创建成功");
		})(req,res,next);
	}
);

module.exports = router;