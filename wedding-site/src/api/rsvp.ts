import axios from "axios";
import { Family } from "../types";

export async function getFamily(code: string): Promise<Family> {
  const res = await axios.get<Family>(`/api/rsvp/${encodeURIComponent(code)}`);
  return res.data;
}
