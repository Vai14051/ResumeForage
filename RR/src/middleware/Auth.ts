import { Request,Response,NextFunction } from "express";
import  jwt  from "jsonwebtoken";
import prisma from "../config/prisma";
require("dotenv").config();

export interface Req extends Request {
  user?: {
    id: string,
    email:string

  };
}

interface JwtPayload{
    id:string;
    email:string;
}



export const protect = async(req:Req,res:Response,next:NextFunction)=>
{
    try{
            // console.log("Here ist he ",req.header("Authorization"))
            const token = req.header("Authorization")!.replace("Bearer", "").trim();

            // console.log("Hereree",token);

            if(!token)
            {
                return res.status(401).json({
                    success:false,
                    message:"Token is missing"
                });
            }

            // verify the token 
            // console.log("before Token")
            // console.log("Her is the token",token)
            const decode = jwt.verify(token,process.env.JWT_SECRET!) as JwtPayload
            console.log(decode,"token is verfying stage ",decode);

            req.user = decode;
                // console.log("Afer token")
            next();

    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:error
            
        });
        
    }
}
