import express from "express";
import passport from "./config/passport";
import cors from "cors";
import helmet from "helmet";

import userRouter from "./routers/userRouter";
import procedureRouter from "./routers/procedureRouter";
import uploadRouter from "./routers/uploadRouter";
import timeSlotRouter from "./routers/timeSlotRouter";
import bookingRouter from "./routers/bookingRouter";

import apiErrorhandler from "./middlewares/errorHandler";
import { authMiddleware } from "./middlewares/authMiddleware";
import { authOwnershipMiddleware } from "./middlewares/authOwnershipMiddleware";
import adminCheck from "./middlewares/adminCheck";
import userStatusCheck from "./middlewares/userStatusCheck";
import path from "path";

const app = express();
const corsOptions = {
   origin: "*",
   credentials: true,
   allowedHeaders: ["Content-Type", "Authorization"],
   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(helmet({
   crossOriginOpenerPolicy: { policy: "unsafe-none" },
}));
app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

const clientBuildPath = path.join(__dirname, '../../../client/dist');
console.log("Serving static files from:", clientBuildPath);
app.use(express.static(clientBuildPath));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/procedures", procedureRouter);
app.use("/api/v1/uploads", uploadRouter);
app.use("/api/v1/time-slots", timeSlotRouter);
app.use("/api/v1/bookings", bookingRouter);

app.use(authMiddleware);
app.use(authOwnershipMiddleware);
app.use(adminCheck);
app.use(apiErrorhandler);
app.use(userStatusCheck);

export default app;