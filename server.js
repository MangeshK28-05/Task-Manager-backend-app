const express = require('express')
const app = express()
app.use(express.json())
const PORT = 8000

const rateLimit = require('express-rate-limit')

const rateLimiter = rateLimit({
    windowMs : 60*1000,
    max: 35,
    message: 'too many requests',
    standardHeaders : true,
    legacyHeaders : false
})

const tasks = [
    { id : 1,task: 'pet the cat'},
    { id: 2, task: 'do homework'},
    { id: 3, task: 'learn express'},
    { id: 4, task: 'use mongo' }
]

app.get('/tasks', rateLimiter, (req,res)=>{
    res.status(200).json({ tasks })
})

app.get('/tasks/:id', rateLimiter, (req, res) => {
    const id = Number(req.params.id)

    const task = tasks.find(task => task.id === id)

    if (!task) {
        return res.status(404).json({ msg: 'task not found' })
    }

    res.status(200).json({ task })
})

app.post('/tasks', rateLimiter, (req, res)=> {
    const {task} = req.body

    if(!task){return res.status(400).json({msg : 'bad request'})}

    const newTask = {
        id: tasks.length +1,
        task : task
    }

    tasks.push(newTask)

    res.status(200).json({task, msg: 'success'})
})

app.put('/tasks/:id', rateLimiter, (req, res) =>{
    const id = Number(req.params.id)
    const {task} = req.body

    const foundTask = tasks.find((task) => task.id === id)

    if(!foundTask){return res.status(400).json({msg: 'not found'})}
    if(!task){return res.status(400).json({msg: 'task is required'})}

    foundTask.task = task

    res.status(200).json({foundTask, msg: 'success'})

})

app.delete('/tasks/:id', rateLimiter, (req,res)=>{
     const id = Number(req.params.id)

    const task = tasks.find((task) => task.id === id)

     if (!task) {
        return res.status(404).json({ msg: 'task not found' })
    }

    tasks = tasks.filter(task => task.id !== id)

    res.status(200).json({task, msg: 'deleted'})
})

app.listen(PORT, ()=> console.log('connected'))