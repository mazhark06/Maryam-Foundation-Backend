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

// Health check endpoint
app.get('/health', (req, res) => {
  const healthStatus = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
    system: {
      memoryUsage: {
        rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
      }
    }
  };

  try {
    // You can add database connectivity checks here if needed
    // e.g., await db.authenticate();
    
    res.status(200).json(healthStatus);
  } catch (error) {
    healthStatus.status = 'DOWN';
    healthStatus.error = error.message;
    res.status(503).json(healthStatus);
  }
});

app.post('/admin/login', adminVerification)
app.get('/create/admin/:username/:password', createAdmin)

// Program routes
app.use('/api/programs', programRoutes)
app.use('/api/receipt', receiptRoutes)

app.use(errorHandler);


export default app