import api from "../lib/axios";


interface Paste{
    title:string;
    content:string;
    companyName?:string;

}


export const pasteJDAPI = (data:Paste)=>{
    return api.post("/jd/paste",data);
}

export const getJDsAPI = ()=>{
    return api.get("/jd");
}