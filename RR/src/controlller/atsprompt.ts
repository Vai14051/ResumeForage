export const buildScoringPrompt = (resumeText: string, jdText: string): string => {
  return `You are a senior ATS engine and IT industry recruiter. Analyze this resume against the job description.

Return ONLY a valid JSON object. No markdown. No explanation. No code blocks. Just raw JSON.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}

Return exactly this structure:
{
  "score": <number 0-100>,
  "skillScore": <number 0-100>,
  "keywordScore": <number 0-100>,
  "experienceScore": <number 0-100>,
  "educationScore": <number 0-100>,
  "formattingScore": <number 0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "recommendations": ["action 1", "action 2", "action 3"],
  "summary": "2-3 sentence honest assessment of fit"
}

Scoring guide (IT industry standard):
- skillScore: how many required skills from JD appear in resume
- keywordScore: ATS keyword match density
- experienceScore: years and relevance of experience vs JD requirements
- educationScore: education match (degree, certifications)
- formattingScore: ATS-parseable format (no tables, clean headings, standard sections)
- overall score: weighted average, skill + keyword weighted highest`;
};

export const buildRewritePrompt = (
  resumeText: string,
  jdText: string,
  missingSkills: string[],
  recommendations: string[]
): string => {
  return `You are an expert IT resume writer. Rewrite the resume to maximize ATS score for this specific job.

ORIGINAL RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}

MISSING SKILLS TO ADDRESS: ${missingSkills.join(", ")}
RECOMMENDATIONS TO FOLLOW: ${recommendations.join(" | ")}

Rules you must follow:
1. Never fabricate experience, skills, or education — only rewrite what exists
2. Naturally weave in missing keywords where the candidate genuinely has that experience
3. Quantify achievements with numbers where possible (%, $, users, time saved)
4. Use ATS-friendly formatting: clear section headers, bullet points, no tables
5. Follow IT resume standards: Summary → Skills → Experience → Education → Projects
6. Each experience bullet should follow STAR format (Situation/Task, Action, Result)
7. Put the most JD-relevant skills prominently in a dedicated Skills section

Return ONLY the rewritten resume in clean markdown. Start directly with the candidate name.`;
};