import dotenv from "dotenv"

// Load environment variables
dotenv.config()

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // MongoDB connection
  mongo: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017/typescript-api",
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  },
}

export default config

