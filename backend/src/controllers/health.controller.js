const AppError = require("../utils/AppError");
const {getHealthStatus} = require("../services/health.service");
const healthCheck = (req,res,next)=>{
    try{
        const healthData = getHealthStatus();
        res.status(200).json({
            success : true,
            data : healthData
        })
    }
    catch(error){
        next(new AppError("Health check failed",500));
    }
}

module.exports={
    healthCheck
}

