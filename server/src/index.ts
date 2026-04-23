import express from "express";
import cors from "cors";
import { config } from "./config";
import rsvpRoutes from "./routes/rsvp";

const app = express();

app.use(cors({
  origin: config.allowedOrigins,
  methods: ["GET", "POST"],
}));

app.use(express.json());

app.use("/api/rsvp", rsvpRoutes);
app.use("/api//rsvp/guestsResponse", rsvpRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(config.port, () => {
  console.log(`Express server running on port ${config.port}`);
  console.log(`Forwarding requests to Go at ${config.goServerUrl}`);
});
