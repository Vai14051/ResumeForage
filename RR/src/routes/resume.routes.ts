import { Router } from "express";
import { protect } from "../middleware/Auth";
import { upload } from "../config/multer";
import { deleteResume, getResumes, uploadResume } from "../controlller/Resume";

const router = Router();

router.use(protect);

router.post("/upload",upload.single("resume"),uploadResume);
router.get("/",getResumes);
router.delete("/:id",deleteResume);

export default router;
