import api from "../lib/axios";

interface Register{
    name:string;
    email:string;
    password:string;
}
interface Login{
    email:string;
    password:string;
}

export const registerApi = (data:Register)=>{
    return api.post("/auth/register",data);
}


export const loginAPI = (data:Login)=>{
    return api.post("/auth/login",data);
}

