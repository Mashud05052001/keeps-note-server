import express from "express";
import { addANote, deleteAnItem, filterNotes, getAllNotes, getSingleNote, updateANote, } from "../controller/notesController.js";
export const router = express.Router();
router.get("/notes", getAllNotes);
router.get("/note/:id", getSingleNote);
router.get("/filterNotes", filterNotes);
router.patch("/updateNote", updateANote);
router.post("/addANote", addANote);
router.delete("/deleteANote/:id", deleteAnItem);
