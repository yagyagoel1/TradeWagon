import { Router } from "express";
import { signup } from "../controllers/auth.controller";

const router = Router();

router.route("/singup").post(signup);
