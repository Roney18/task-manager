const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/Auth");

const router = express.Router();

//create task

router.post("/", auth, async (req, res)=> {
    const { title, description } = req.body;

    try {
        const task= new Task({
            user: req.user,
            title,
            description
        });

        await task.save();
        res.status(201).json({message: "Task created"});
    } catch(error){
        res.status(500).json({message: error.message});
    }
});

// get task

router.get("/", auth, async( req, res)=>{
    const tasks = await Task.find({ user: req.user});
    res.json(tasks);
});

// update task
router.put("/",auth, async(req,res)=>{
    const task = await Task.findById(req.params.id);
    if(!task) return res.status(400).json({message: "No task found"});

    if(task.user.toString() !== req.user)
        return res.status(400).json({message: "Not Authorizzed"});
    Object.assign(task, req.body);
    await task.save();

    res.json(task);
});

//delete task

router.delete("/:id", auth,async(req,res)=> {
    const task = await Task.findById(req.params.id);

    if(!task) return res.status(400).json({message: "Task not found"});

    if(task.user.toString() !== req.user)
        return res.status(401).json({message: "Not Authorized"});

    await task.deleteOne();
    res.json({message: "Task deleted"});
});
module.exports = router;