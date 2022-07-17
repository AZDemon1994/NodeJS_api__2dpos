const DB = require("../module/user");
const Helper = require("../utils/helper");

const all = async(req,res,next)=>{
    let users = await DB.find().populate("agentId", "-passwd");
    Helper.fMsg(res,"Get All User!",users);
}

const add = async(req,res,next)=>{
    let user = await DB.findOne({phone: req.body.phone});
    if(user){
        next(new Error("This phone is aleardy used!"));
    }else{
        req.body.passwd = Helper.encodePass(req.body.passwd);
        let result = await DB(req.body).save();
        Helper.fMsg(res,"Add User Success!", result);
    }
    
}

const login = async(req,res,next)=>{
    let loginUser = await DB.findOne({phone: req.body.phone});
    if(loginUser){
        if(Helper.comparePass(req.body.passwd, loginUser.passwd)){
            let user = loginUser.toObject();
            delete user.passwd;
            user.token = Helper.makeToken(user);
            Helper.fMsg(res,"Login Success!", user);
        }else{
            next(new Error("Phone or Password is wrong!"))
        }
    }else{
        next(new Error("Phone or Password is wrong!"))
    }
}

const patch = async(req,res,next)=>{
    Helper.fMsg(res,"Edit User!");
}

const drop = async(req,res,next)=>{
    Helper.fMsg(res,"Delete User!");
}



module.exports = {
    add,
    patch,
    drop,
    login
}