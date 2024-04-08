import dotenv from "dotenv";

dotenv.config()

export const settings = {
    JWT_SECRET: process.env.JWT_SECRET || "123",
    PORT: process.env.PORT || 3000,
    AUTH_MAILER: {
        USER: process.env.USER || "uladzislauzasko@gmail.com",
        PASS: process.env.PASS || "umsq htqn xobb yfwj"
    }
}