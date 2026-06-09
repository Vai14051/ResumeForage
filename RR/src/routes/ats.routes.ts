import { Router } from "express";
import { protect } from "../middleware/Auth";
import { analyzeController, generateController, getGenerateController, getSingleReportController, historyController } from "../controlller/ATS";


const router = Router();

router.use(protect);


router.post("/analyze", analyzeController);
router.post("/generate", generateController);
router.get("/history", historyController);
router.get("/generated", getGenerateController);
router.get("/report/:id", getSingleReportController);

export default router;