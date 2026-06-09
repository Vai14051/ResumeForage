import { Request, response, Response } from "express";
import { Req } from "../middleware/Auth";
import prisma from "../config/prisma";
import { groq, MODEL, VISION_MODEL } from "../config/groq";

const callAI = async (prompt: string, maxTokens: number = 1500): Promise<string> => {
    const response = await groq.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
    });
    return response.choices[0].message.content || "";
};



export const pasteJDController = async (req: Req, res: Response) => {
    try {


        const { title, content, companyName } = req.body;

        const userId = req.user!.id;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Job Description content is required"
            });
        }
        console.log("breofer the ai");
        const response = await callAI(
            `Extract all required technical skills from this job description. Return ONLY a JSON array of strings. No markdown, no explanation, just the raw array.

Example: ["React", "Node.js", "PostgreSQL", "Docker"]

Job Description:
${content}`
        );
        console.log("after the ai ");

        let extractedSkills: string[] = [];

        try {
            const text = response.replace(/```json|```/g, "").trim();
            extractedSkills = JSON.parse(text);
        } catch {
            extractedSkills = [];
        }

        const jd = await prisma.jobDescription.create({
            data: {
                title,
                content,
                companyName,
                extractedSkills,
                source: "paste",
                userId,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Job Description Saved",
            data: jd
        })

    }
    catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
}


export const getJDsController = async (req: Req, res: Response) => {
    try {
        const userId = req.user!.id;

        const getUserJDs = await prisma.jobDescription.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                companyName: true,
                source: true,
                extractedSkills: true,
                createdAt: true,
            },

        });
        return res.status(200).json({
            success: true,
            message: "JD is fetched",
            data: getUserJDs,
        })



    }
    catch (error) {
        res.status(404).json({ success: false, message:error || "JD not found" });

    }
}
