import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import 'dotenv/config'
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

//app config
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'https://food-dev-frontend.onrender.com', // Replace with your frontend URL
    'https://food-dev-admin.onrender.com',
    'http://localhost:3000' // Allow localhost for development
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
//middleware
app.use(express.json())
app.use(cors())

// Static file serving with CORS headers for images
app.use('/images', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    next();
}, express.static("uploads"));

app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'no-referrer');
    next();
})
//db connection
connectDB();

// api endpoints
app.use('/api/food', foodRouter)
app.use('/images', express.static("uploads"))
app.use('/api/user', userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

app.get("/", (req, res) => {
    res.send("API working")
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))


//mongodb+srv://dbUser:dbUserPassword@cluster0.bqxt4kc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0