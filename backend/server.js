import express from 'express';
import helmet, {contentSecurityPolicy} from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';

import productRoutes from "./routes/productRoutes.js";
import db from "./config/db.js";
import {aj} from "./lib/arcjet.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(cors()); //prevents unauthorized cross-origin requests, protecting users from malicious websites
app.use(helmet({ //enhances the security of web applications by setting various HTTP headers.
    contentSecurityPolicy: false
}));
app.use(morgan('dev')); //HTTP request logger middleware that simplifies the process of logging requests
app.use(express.json());

//apply arc jet rate-limits to all routes
app.use(async (req,res,next) => {
    try{
        const decision = await aj.protect(req, {
            requested: 1 //specifies that each request consumes 1 token
        })

        if(decision.isDenied()){
            if(decision.reason.isRateLimit())
                res.status(429).json({error:"Rate limit reached"});
            else if(decision.reason.isBot())
                res.status(403).json({error:"Bot access denied"});
            else
                res.status(403).json({error:"You are not authorized to use this route"});
        }

        //check for spoofed bots
        if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())){
            res.status(403).json({error:"Spoofed bot detected"});
            return;
        }
        next();
    } catch (e) {
        console.log("Arcjet error",e);
        next(e);
    }
})

app.use("/api/products", productRoutes);

await db.query(`CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

export default app;