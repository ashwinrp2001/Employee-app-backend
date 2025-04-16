// Task1: initiate app and run server at 3000
const express = require("express");
const app = express();
const morgan = require("morgan")
app.use(morgan("dev"))
require("dotenv").config();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log('Server is running on PORT 3000');
})


// Task2: create mongoDB connection 
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL).then( () =>{
    console.log("connection established")
}).catch( () => {
    console.log("connection not established");
})


const employeeSchema = mongoose.Schema({
    name : String,
    location : String,
    position : String,
    salary : Number
})

const employeeModel = mongoose.model("employees",employeeSchema)

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below
//TODO: get data from db  using api '/api/employeelist'
app.get("/api/employeelist", async(req,res) =>{
    try {
        const data = await employeeModel.find({})
        res.status(200).send(data)
    } catch (error) {
        res.status(404).send(error)
    }
})

//TODO: get single data from db  using api '/api/employeelist/:id'
app.get("/api/employeelist/:id", async(req,res) =>{
    try {
        const data = await employeeModel.findOne({_id : req.params.id})
        if (!data) {
            return res.status(404).send({ message: "Employee not found" });
        }
        res.status(200).send(data)
    } catch (error) {
        res.status(404).send(error)
    }
})

//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.post("/api/employeelist",async(req,res) =>{
    try{
        const data = new employeeModel(req.body)
        await data.save()
        res.status(200).send("Post successful")
    } catch (error){
        res.status(404).send("Post unsuccessful")
    }
})

//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete("/api/employeelist/:id",async(req,res) =>{
    try{
        await employeeModel.findByIdAndDelete(req.params.id,req.body)
        res.status(200).send("Delete successful")
    } catch (error){
        res.status(404).send("Delete unsuccessful")
    }
})

//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put("/api/employeelist", async (req, res) => {
    try {
    
      if (!req.body._id) {
        return res.status(400).json({ error: "Employee ID is required for update" });
      }
  
      const updatedEmployee = await employeeModel.findOneAndUpdate(
        { _id: req.body._id },
        req.body,
        { new: true }
      );
  
      if (!updatedEmployee) {
        return res.status(404).json({ error: "Employee not found" });
      }
        res.status(200).send("Update successful");
    } catch (error) {
        res.status(500).send("Update unsuccessful");
    }
});

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});