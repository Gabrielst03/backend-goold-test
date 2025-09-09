import express from 'express';
import sequelize from '../config/database.js';

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import logsRoutes from './routes/logsRoutes.js';

const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/logs", logsRoutes);

async function start() {
    try {
        await sequelize.authenticate();
        console.log("✅ Conexão bem-sucedida com o banco!");

        await sequelize.sync();
        console.log("✅ Modelos sincronizados com o banco!");

        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (error) {
        console.error("❌ Erro ao conectar:", error);
    }
}

start();
