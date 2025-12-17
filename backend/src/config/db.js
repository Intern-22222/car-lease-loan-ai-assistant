const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connectToDB = async()=>{
    try{
            await mongoose.connect(process.env.MONGO_URI);
            console.log("Mongo DB connected...");
    }
    catch(error){
        console.log("Error",error.message);
        process.exit(1);
    }
}

module.exports = connectToDB;
