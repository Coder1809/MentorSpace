import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load from server/.env, current directory, or root MentorSpace/.env
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

if (!process.env.PORT) {
  console.warn("Warning: .env not loaded or missing variables");
}
