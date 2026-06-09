import type { IconType } from "react-icons";

// Data interfaces
export interface Resume {
  id: string;
  title: string;
  fileType:".pdf" | ".docx"
  createdAt:string;
}

export interface JobDescription {
  id: string;
  title: string;
  companyName?: string;
}

export interface ATSHistory {
  id: string;
  score: number;
  resume?: Resume;
  jobDescription?: JobDescription;
}

// Component props interfaces
export interface StatCardProps {
  label: string;
  value: string | number;
  icon: IconType;
  color: string;
  loading: boolean;
}

export interface ActionCardProps {
  title: string;
  description: string;
  icon: IconType;
  color: string;
  onClick: () => void;
}

export interface Scorebar{
    label:string;
    value:number;
    colorScheme:string;
}



export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ATSHistory {
  id: string;
  score: number;
  skillScore: number;
  keywordScore: number;
  experienceScore: number;
  educationScore: number;
  formattingScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  summary: string;
  resumeId: string;
  jobDescriptionId: string;
  userId: string;
  createdAt: string;
  resume?: Resume;
  jobDescription?: JobDescription;
  user?: User;
}


export interface GenResume {
  id:string;
  title:string;
  content:string;
  atsScore:number;
  resumeId:string;
  jobDescriptionId:string;
  userId:string;
  createdAt:Date;
  resume:Resume;
  jobDescription:JobDescription;
  user:User
}