import app from "./src/app.js";
import connectDatabase from "./src/config/db.js";
import env from "./src/config/env.js";

const startServer = async () => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });
};

startServer();
