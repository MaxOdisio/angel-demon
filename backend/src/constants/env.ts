import 'dotenv/config';

export const PORT = process.env.PORT || 3000;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
if (!OPENAI_API_KEY || OPENAI_API_KEY == "") {
  throw new Error("OPENAI_API_KEY not defined in .env");
}
