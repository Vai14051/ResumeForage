import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../config/prisma"
import { Request, Response } from "express"


export const registerUser = async (req: Request, res: Response) => {
    try {

        const { name, email, password } = req.body;
        console.log("Here is the ",name, email, password);

        const exsitingUser = await prisma.user.findUnique({
            where: { email }
        });
            console.log("Here is the ",name, email, password);

        if (exsitingUser) {
            return res.status(401).json({
                success: false,
                message: "User is already Exist"
            });
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name, email, password: hashedPassword,
            }
        });

        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            data: user
        });


    }

    catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"

        })

    }

}

export const loginUser = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Deatils are not valid"
            });
        };

        console.log("here is the data",email,password);

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered "
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);

        console.log("Here is the Password",isPasswordCorrect);
        const payload = {
            id:user.id,email:user.email
        }

        if(isPasswordCorrect)
        {
            const token = jwt.sign(payload,process.env.JWT_SECRET as string,
                {expiresIn:"1d"}
            );

            // const refreshToken = jwt.sign({id:user.id},process.env.JWT_SECRET as string,{
            //     expiresIn:"2d"
            // });

            return res.status(200).json({
                success:true,
                message:"User Logged IN Successfully",
                token,
                // refreshToken,
                user
            })

        }
        return res.status(402).json({
            success:false,
            message:"Password is incorrect",
        })

    }
    catch (error) {
            
    }




}