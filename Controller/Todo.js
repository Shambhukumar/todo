const Todo = require("../Model/Todo");



exports.Savetodo = (req,res)=>{
    console.log(req.body)
    const content = req.body.content;
    const uid = req.user.user._id;
    const priority = req.body.priority;
    const date = new Date();

        Todo.create({content,uid,priority,date}, (err,data)=>{
           if(err){
               res.status(400).json({
                   Status: "Fail",
                   message: "Something went Wrong"
               })
           }else{
            FatchdataAndSend(req.user.user,res)
           }
        })

}

exports.getTodo = (req,res) =>{
    console.log("Working")
    const uid = req.user.user._id;
    FatchdataAndSend(req.user.user,res)
}

exports.deleteTodo = (req,res) =>{
    const id = req.body.id
    const uid = req.user.user._id;
    console.log(id)
    Todo.deleteOne({"_id": id}, (err,Resp)=>{
        FatchdataAndSend(req.user.user,res)
        
    })
}

exports.updateTodo = (req,res)=>{
    const content = req.body.content;
    const priority = req.body.priority;
    const id = req.body.id;
    const uid = req.user.user._id;
    Todo.findByIdAndUpdate(id, {content,priority},(err,updateResp)=>{
        if(updateResp){
        FatchdataAndSend(req.user.user,res)
        }
        if(err){
            console.log(err)
        }
    })
}
exports.getTodoBySort = (req,res) =>{
    const obj = req.body.obj;
    console.log(req.body)
    const uid = req.user.user._id;
    Todo.find({uid},(err,findResp)=>{
        if(findResp){
            res.status(201).json({
                message: "success",
                data: findResp,
                isAuthenticated: true,
                user: req.user
            })
        }
        if(err){
            console.log(Err)
        }
    }).sort(obj)
}

const FatchdataAndSend = (user,res) =>{
    const uid = user._id;
    Todo.find({uid}, (findErr,findResp)=>{
        if(findErr){
            res.status(400).json({
                Status: "Fail",
                message: "Something went Wrong"
            })
        }else{
         res.status(200).json({
             Status: "Success",
             data: findResp,
             isAuthenticated: true,
             user: user
         })
        }
    })
}

