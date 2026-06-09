import { Router } from "express";
import { loginUser, registerUser } from "../controlller/auth";
import { protect } from "../middleware/Auth";

const router = Router();

router.post("/register",registerUser);
router.post("/login",loginUser);

router.get("/me",protect,(req,res)=>{
   return res.send({
        message:"Here is the private route",
        success:true,
    });
});

export default router;