const HealthLog = require("../models/HealthLog.model")

const getHealthStatus=()=>{
    HealthLog.create({status:"OK"});
    return{
        status : "OK",
        timestamp : new Date().toISOString()   
    }
}

module.exports={
    getHealthStatus
}