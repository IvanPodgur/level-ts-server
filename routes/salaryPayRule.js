import express from "express";
import { SalaryPayRule } from "../models/salaryPayRule";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Create salary pay rule");
});

router.get("/:spr", async (req, res) => {
  //get salary pay rule (spr)
});
