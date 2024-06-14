import dotenv from "dotenv";
dotenv.config();

export const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/game-DB';
export const port = process.env.PORT || 3000;
export const secret = process.env.SECRET_PASSWORD || 'stardewspicycolalandrymonkey'

