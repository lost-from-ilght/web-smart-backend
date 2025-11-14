import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Import routes
import UsersRoutes from "./routes/user_routes.js";
import HomeRoutes from "./routes/home_routes.js";
import CommandRoutes from "./routes/command_routes.js";
import TvRoutes from "./routes/tv_routes.js";
import RoomRoutes from "./routes/room_routes.js";
import SwitchRoutes from "./routes/switch_routes.js";
import OnOffRoutes from "./routes/onoff_routes.js";
import AcRoutes from "./routes/ac_routes.js";
import TemperatureRoutes from "./routes/temperature_routes.js";
import HumidityRoutes from "./routes/humidity_routes.js";
import GasRoutes from "./routes/gas_routes.js";
import FireRoutes from "./routes/fire_routes.js";
import SmokeRoutes from "./routes/smoke_routes.js";
import MusicRoutes from "./routes/music_routes.js";
import NotificationRoutes from "./routes/notfication_route.js";
import AuthRoutes from './routes/auth_routes.js'
import ActivityRoutes from "./routes/activity_routes.js";
import DangerRoutes from "./routes/danger_routes.js";
import OnificationRoutes from './routes/otification_routes.js'
import OfficeRoutes from './routes/office_routes.js'
import ButtonRoutes from './routes/button_routes.js'

// Define routes
app.use('/api/home', HomeRoutes);
app.use('/api/commands', CommandRoutes);
app.use('/api/tv', TvRoutes);
app.use('/api/room', RoomRoutes);
app.use('/api/switch', SwitchRoutes);
app.use('/api/onoff', OnOffRoutes);
app.use('/api/ac', AcRoutes);
app.use('/api/temperature', TemperatureRoutes);
app.use('/api/humidity', HumidityRoutes);
app.use('/api/gas', GasRoutes);
app.use('/api/fire', FireRoutes);
app.use('/api/smoke', SmokeRoutes);
app.use('/api/music', MusicRoutes);
app.use('/api/notification', NotificationRoutes);
app.use('/api/user', UsersRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/activity', ActivityRoutes);
app.use('/api/danger', DangerRoutes);
app.use('/api/otifications', OnificationRoutes)
app.use('/api/office', OfficeRoutes)
app.use('/api/button', ButtonRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Backend Million API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend Million API', 
        version: '1.0.0',
        status: 'running'
    });
});

export default app;

