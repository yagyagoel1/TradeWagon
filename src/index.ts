import dotenv from "dotenv";
import app from "./app";

dotenv.config({
  path: "./../.env",
});
try {
  app.on("error", (error) => {
    throw error;
  });
  app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.port}`);
  });
} catch (error) {
  console.error("error while listening ", error);
}
