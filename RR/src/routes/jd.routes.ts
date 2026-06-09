import { Router } from "express";
import { protect } from "../middleware/Auth";
import { getJDsController, pasteJDController } from "../controlller/jobDescription";



const router = Router();

router.use(protect);

router.post("/paste",pasteJDController);
router.get("/",getJDsController);
export default router;
