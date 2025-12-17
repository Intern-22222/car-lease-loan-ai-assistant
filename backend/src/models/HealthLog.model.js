const mongoose = require("mongoose");

const healthSchema = new mongoose.Schema({
        status:{
            type:String,
            required:true
        },
        checkedAt:{
            type:Date,
            default:Date.now
        }
})

module.exports = mongoose.model("HealthLog",healthSchema);
