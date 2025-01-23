import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
   res.status(200).json({ message: "Hello, this is the Enroll App API!" });
});

export default router;