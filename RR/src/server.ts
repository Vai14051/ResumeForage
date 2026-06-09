import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import resumeRoutes from "./routes/resume.routes";
import jdroutes from "./routes/jd.routes";
import atsroutes from "./routes/ats.routes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors(
    {
        origin:"*",
        credentials:true
    }
));


app.use(morgan("dev"));
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/jd", jdroutes);
app.use("/api/ats", atsroutes);

app.use("/check",(req,res)=>{
    res.send({
        message:"heasltj ok "
    })
});


app.get("/test", (_req: Request, res: Response): void => {
  res.json({
    success: true,
    message: "Server Is Running"
  });
});

app.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
});