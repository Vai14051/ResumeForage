import { Request, Response } from "express";
import type { Req } from "../middleware/Auth";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import cloudinary from "../config/cloudinary";
import prisma from "../config/prisma";
import streamifier from "streamifier"
// import type { JwtPayload } from "../middleware/Auth";
// Helpers

const parsepdf = async (buffer: Buffer) => {
    const data = await pdfParse(buffer);
    return data.text;
};

const parseDocx = async (buffer: Buffer) => {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
}

const uploadToCloudinary = (
    buffer: Buffer,
    fileName: string
): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "resumeforge/resumes",
                resource_type: "raw",
                public_id: `${Date.now()}-${fileName}`,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

// uploadResume 

export const uploadResume = async (req: Req, res: Response) => {

    try {
        console.log("Here is the files",req.file,req.body);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const userId = req.user!.id  ;
        const ext = path.extname(req.file.originalname).toLowerCase();

        let parsedText = "";

        if (ext === ".pdf") {
            parsedText = await parsepdf(req.file.buffer);
        } else if (ext === ".docx") {
            parsedText = await parseDocx(req.file.buffer);
        }

        const uploaded = await uploadToCloudinary(
            req.file.buffer,
            req.file.originalname
        );

        console.log("here is the uploaded file ", uploaded)

        const resume = await prisma.resume.create({
            data: {
                title: req.file.originalname.replace(ext, ""),
                fileUrl: uploaded.secure_url,
                publicId: uploaded.public_id,
                fileType: ext,
                parsedText,
                userId
                
            },
        });

        res.status(201).json({
            success: true,
            data: resume,
        });



    }

    catch (error:any) {
        return res.status(500).json({
            sucess: false,
            message: error.message
        })
    }





}

export const getResumes = async(req:Req,res:Response)=>{
    try{

        const userId= req.user!.id;

        console.log("Here is the user id ",userId);

        const resumes = await prisma.resume.findMany({
            where:{userId},
            orderBy:{createdAt:"desc"},
            select:{
                id:true,title:true,fileType:true,isPrimary:true,createdAt:true,fileUrl:true
            }
        });

        console.log("Hers is resume response",resumes);

        res.status(200).json({
            sucess:true,
            data:resumes,
        })

    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }

}

export const deleteResume = async(req:Req,res:Response)=>{
    try{
            const userId = req.user!.id;
            const id = req.params.id as string;
            console.log("here is the id to delete",id);

           const resum =  await prisma.resume.findFirst({
                where:{
                    id,userId
                }
            });

            if(!resum)
            {
                return res.status(400).json({
                    success:false,
                    message:"Resume not found"
                })
            }
            await cloudinary.uploader.destroy(resum.publicId,{resource_type:"raw"});
            await prisma.resume.delete({where:{id}});


            return res.status(200).json({
                    success:true,
                    message:"Resume is Deleted"    
            })

    }
    catch(error)
    {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

