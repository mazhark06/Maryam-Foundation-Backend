import express from "express";
import "dotenv/config.js"
import cors from "cors"
import db from "./db/db.js";
import dns from "dns"
import { adminVerification, createAdmin } from "./Controllers/Admin.controller.js";
import errorHandler from "./utils/ErrorHandler.js";
import programRoutes from "./Routes/Program.route.js";
import receiptRoutes from "./Routes/receipt.route.js"

const app = express();

dns.setServers(["8.8.8.8","8.8.4.4"]);

db();


app.use(cors({
    origin:[process.env.ORIGIN],
    credentials:true
}))
app.use(express.json())



app.post('/admin/login', adminVerification)
app.get('/create/admin/:username/:password', createAdmin)

// Program routes
app.use('/api/programs', programRoutes)
app.use('/api/receipt', receiptRoutes)

app.use(errorHandler);

export default app