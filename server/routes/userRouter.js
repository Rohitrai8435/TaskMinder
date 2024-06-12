import express from "express";
import {
  login,
  logout,
  myProfile,
  register,
  alluser,
  deleteuser,
  singleuser,
} from "../controller/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, myProfile);
router.post("/register", register);
router.get("/alluser", alluser);
router.get("/singleuser/:id", singleuser);
router.post("/register", register);
router.delete("/delete/:id", deleteuser);

export default router;
