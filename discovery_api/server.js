import app from "./app.js";
import { sequelize } from "./models/model.js";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.sync({ alter: false });
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
})();
