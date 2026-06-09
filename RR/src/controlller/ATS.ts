import { Request, Response } from "express";
import { Req } from "../middleware/Auth";
import prisma from "../config/prisma";
import { buildRewritePrompt, buildScoringPrompt } from "./atsprompt";
import { groq,MODEL,VISION_MODEL } from "../config/groq";

const callAI = async (prompt: string, maxTokens: number = 1500): Promise<string> => {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: maxTokens,
  });
  return response.choices[0].message.content || "";
};

export const analyzeController = async (req: Req, res: Response) => {
    try {

        const userId = req.user!.id;
        const { resumeId, jobDescriptionId } = req.body;

        if (!resumeId || !jobDescriptionId) {
            return res.status(400).json({
                success: false,
                message: "Resume and JobDescription"
            });
        }
        const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId } });
        const jd = await prisma.jobDescription.findFirst({ where: { id: jobDescriptionId, userId } });
        const prompt = buildScoringPrompt(resume!.parsedText, jd!.content);

        const response = await callAI(prompt,1500);

        const rawText = response;

        console.log("here is the rawText", rawText);

        let analysis: any;

        try {
            analysis = JSON.parse(rawText);
        } catch {
            // Try to extract JSON if Claude added any extra text
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysis = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Failed to parse AI response");
            }
        }

        const report = await prisma.aTSReport.create({
            data: {
                score: analysis.score,
                skillScore: analysis.skillScore,
                keywordScore: analysis.keywordScore,
                experienceScore: analysis.experienceScore,
                educationScore: analysis.educationScore,
                formattingScore: analysis.formattingScore,
                matchedSkills: analysis.matchedSkills,
                missingSkills: analysis.missingSkills,
                recommendations: analysis.recommendations,
                summary: analysis.summary,
                resumeId,
                jobDescriptionId,
                userId,

            }
        })

        return res.status(200).json({
            success: true,
            message:"The Generated Resume",
            data:report
        })


    }
    catch (error:any) {
        return res.status(500).json({
            success:false,
            message:error.message
        })



    }

}

export const generateController = async (req: Req, res: Response) => {
    try {

        const userId = req.user!.id;

        const { resumeId, jobDescriptionId } = req.body;

        if (!resumeId || !jobDescriptionId) {
            return res.status(400).json({ success: false, message: "resumeId and jobDescriptionId are required" });
        }
        const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId } });
        const jd = await prisma.jobDescription.findFirst({ where: { id: jobDescriptionId, userId } });

        const atsReport = await prisma.aTSReport.findFirst({
            where: {
                resumeId, jobDescriptionId, userId
            },
            orderBy: { createdAt: "desc" }
        });

        const missingSkills = atsReport ? (atsReport.missingSkills as string[]) : [];
        const recommendations = atsReport ? (atsReport.recommendations as string[]) : [];

        const prompt = buildRewritePrompt(resume!.parsedText, jd!.content, missingSkills, recommendations)

        const response = await callAI(prompt);
        const content = response;

        console.log("Here is the reponse from the ai",content)

        const generated = await prisma.generatedResume.create({
            data: {
                title: `${resume!.title} — optimized for ${jd!.title}`,
                content,
                atsScore: atsReport?.score,
                resumeId,
                jobDescriptionId,
                userId,
            },
        });

        // console.log("Here ist he efgwegewgwegewgew")

        // const jsonparsed = JSON.parse(generated.content);
        res.status(201).json({
            success: true,
            message: "Optimized resume generated",
            data: generated,
            // jsonparsed
        });


    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const historyController = async (req: Req, res: Response) => {
    try {
        const userId = req.user!.id;

        const history = await prisma.aTSReport.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                resume: { select: { title: true, fileType: true } },
                jobDescription: { select: { title: true, companyName: true } },
            },
        });

        console.log("Here is the history",history);
        
        return res.status(200).json({
            success: true,
            data: history,
        })

    }

    catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}

export const getSingleReportController = async (req: Req, res: Response) => {
    try {
        const userId = req.user!.id;
        const id = req.params.id as string;

        const report = await prisma.aTSReport.findFirst({
            where: { id, userId },
            include: {
                resume: { select: { title: true } },
                jobDescription: { select: { title: true, companyName: true } }
            },
        });

        res.status(200).json({
            success: true,
            data: report,
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })

    }
}

export const getGenerateController = async (req: Req, res: Response)=>
{
    try {

        const userId = req.user!.id;

        const genrated = await prisma.generatedResume.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                resume: { select: { title: true } },
                jobDescription: { select: { title: true, companyName: true } },
            }
        });
        res.status(200).json({ success: true, data: genrated });

    }
    catch (error) {
        res.status(500).json({
            succes: false,
            message: "Internal Server Error"
        })
    }
}