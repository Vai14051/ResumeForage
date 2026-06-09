import api from "../lib/axios";

export const uploadResumeAPi = (formData:FormData)=>
{
    return api.post("/resumes/upload",formData,{
        headers:{"Content-Type":"multipart/form-data"},
    });
}

export const getResumeAPI = ()=>{
    return api.get("/resumes");
}

export const getResumesAPI = getResumeAPI;

export const getSingleResumeAPI = (id:string)=>{
    return api.get(`/resumes/${id}`);
}

export const deleteResumeApi = (id:string)=>{
    return api.delete(`/resumes/${id}`);
}