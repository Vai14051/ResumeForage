import api from "../lib/axios";

interface AResume{
    resumeId:string;
    jobDescriptionId:string;
}

type GResume = AResume;

export const analyzeResumeAPI = (data:AResume)=>{

    return api.post("/ats/analyze",data);

}


export const generateResume = (Data:GResume)=>{
    return api.post("/ats/generate",Data);
}

export const generateResumeAPI = generateResume;

export const getATSHistoryAPI = ()=>{
    return api.get("/ats/history");
}

export const getSingleReportApi = (id:string)=>{
    return api.get(`/ats/report/${id}`);
};

export const getGeneratedResumeAPI = ()=>{
    return api.get("/ats/generated");
}