import { Router, Request, Response } from "express";
import { getInviteByCode, NotFoundError, GoServerError, postRsvpResponses } from "../goClient";

const router = Router();

// GET /api/rsvp/:code
router.get("/:code", async (req: Request, res: Response) => {
  const { code } = req.params;

  if (!code || code.trim().length === 0) {
    console.log("No code provided");
    res.status(400).json({ error: "RSVP code is required" });
    return;
  }

  try {
    const family = await getInviteByCode(code.trim());
    console.log("Family found:", family.familyName);
    res.json(family);
  } catch (err) {
    if (err instanceof NotFoundError) {
      console.log("Code not found");
      // Clean 404 — the code just doesn't exist
      res.status(404).json({ error: "RSVP code not found" });
      return;
    }

    if (err instanceof GoServerError) {
      console.log("Go server error", err.message);
      // Go is down or misbehaving — don't expose internals
      res.status(503).json({ error: "Service temporarily unavailable" });
      return;
    }

    // Unexpected error — log it server-side, return generic message
    console.error("Unexpected error in GET /api/rsvp/:code", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// POST /api/rsvp/guestsResponse
router.post("/guestsResponse", async (req: Request, res: Response) => {
  const { familyId, responses: guestResponses } = req.body;

  // Check for required fields
  if (!familyId || !Array.isArray(guestResponses)) {
    res.status(400).json({ error: "familyId and responses array are required" });
    return;
  }

  try {
    // console.log(responses);
    const success = await postRsvpResponses({ familyId, responses: guestResponses });
    res.status(200).json({ message: "RSVP responses received" });
  } catch (err) {
    console.error("Error saving RSVP responses", err);
    res.status(500).json({ error: "Failed to save RSVP responses" });
  }
});

export default router;
