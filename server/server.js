import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import env from "./src/config/environment.js";

const startServer = async () => {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`Server is listening on PORT ${env.port}`);
    });
  } catch (error) {
    console.error("Server failed:", error.message);

    process.exit(1);
  }
};

startServer();
