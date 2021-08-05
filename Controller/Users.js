const User = require("../Model/Users");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");



exports.CreateUserOrLogin = (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.find({email}, async(err,data)=>{
        if(err){
            res.status(400).json({
                status: "Error",
                message: "something went Wrong"
            })
        }
        if(data.length > 0){
            const IsPasswordSame = await bcrypt.compare(password,data[0].password)
            if(IsPasswordSame){
                data[0].password = undefined;
                const token = jwt.sign({user: data[0], iat: Date.now()+(50*1000)}, process.env.SECRET)
                res.cookie("token", token,{ sameSite: "none", secure: true })
                res.status(200).json({
                    status: "Success",
                    message: "logged in successfully",
                    data,
                    isAuthenticated: true
                })
            }else{
                res.status(401).json({
                    status: "Success",
                    message: "Sorry Your password is invalid"
                })
            }
            
        }else{

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            User.create({email,password: hashedPassword}, (CreateErr,createResp)=>{
                if(CreateErr){
                    res.status(400).json({
                        status: "Error",
                        message: "something went Wrong"
                    })
                }
                if(createResp){
                    createResp.password = undefined;
                    const token = jwt.sign({user: createResp, iat: Date.now()+(50*1000)}, process.env.SECRET)
                    res.cookie("token", token)
                    res.status(200).json({
                        status: "Success",
                        data:createResp,
                        isAuthenticated: true
                    })
                }
            })
        }
    })
}

exports.logout = (req,res) =>{
    res.clearCookie("token",{ sameSite: "none", secure: true })
    return res.status(202).json({
        status: "success",
        message: "user logged out"
    })
}

