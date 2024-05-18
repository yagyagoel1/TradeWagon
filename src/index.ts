import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./db";

dotenv.config({
  path: "./../.env",
});
connectDB()
  .then(() => {
    try {
      app.on("error", (error) => {
        throw error;
      });
      app.listen(process.env.PORT, () => {
        console.log(`listening on port ${process.env.PORT}`);
      });
    } catch (error) {
      console.error("error while listening ", error);
    }
  })
  .catch((error) => {
    console.error("error while connecting to db ", error);
  });
