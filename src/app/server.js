import express from 'express';
import sequelize from '../config/database.js';


const app = express();

app.use(express.json());

async function start() {
    try {
        await sequelize.authenticate();
        console.log("✅ Conexão bem-sucedida com o banco!");
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (error) {
        console.error("❌ Erro ao conectar:", error);
    }
}

start();
