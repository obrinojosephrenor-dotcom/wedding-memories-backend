const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const limiter =
  require("./middleware/rateLimiter");

const errorHandler =
  require("./middleware/errorHandler");

  const authRoutes =
  require("./routes/authRoutes");

  const uploadRoutes = require("./routes/uploadRoutes");

  const adminRoutes =
  require("./routes/adminRoutes");

const app = express();
app.use(express.json());

app.use(helmet());


app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/upload", uploadRoutes);


app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(limiter);

app.get("/", (req, res) => {
  res.json({
    app: "Our Wedding Memories API",
  });
});

app.use(errorHandler);

module.exports = app;