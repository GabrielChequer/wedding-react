import axios, { AxiosError } from "axios";
import { config } from "./config";

// Mirror the shapes of responses from Go
export interface FamilyMember {
  guestID: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  songRequest: string;
  isPlusOne: boolean;
  rsvpStatus?: "Pending" | "Declined" | "Accepted";
}

export interface Family {
  familyId: string;
  familyName: string;
  isTraveling: boolean;
  mailingAddr: string;
  invitationCode: string;
  familyMembers: FamilyMember[];
}

interface RsvpResponse {
  familyId: string;
  responses: {
    guestId: string;
    answer: 3 | 2;
    songRequest: string;
    emailAddress: string;
    isPlusOne: boolean;
    plusOneFirstName?: string | null;
    plusOneLastName?: string | null;
  }[];
}

interface GoResponse<T> {
  code: number;
  data: T;
}

const goClient = axios.create({
  baseURL: config.goServerUrl,
  timeout: 8000,
});

export async function getInviteByCode(rsvpCode: string): Promise<Family> {
  try {
    const res = await goClient.get<GoResponse<Family>>("/searchInvite", {
      params: { rsvpCode },
    });

    if (res.data.code !== 200) {
      throw new NotFoundError(`No invite found for code: ${rsvpCode}`);
    }

    return res.data.data;
  } catch (err) {
    if (err instanceof NotFoundError) throw err;

    // Go server is unreachable or returned a non-2xx HTTP status
    const axiosErr = err as AxiosError;
    if (axiosErr.response?.status === 404) {
      throw new NotFoundError(`No invite found for code: ${rsvpCode}`);
    }

    throw new GoServerError("Go server request failed");
  }
}

export async function postRsvpResponses(rsvpResponse: RsvpResponse): Promise<boolean> {
  try {
    console.log(rsvpResponse);
    const res = await goClient.post<GoResponse<null>>("/respond-rsvp", rsvpResponse);
    return true;
  } catch (err) {
    console.error("Error submitting RSVP responses", err);
    return false;
  }
}

// Typed errors so routes can handle them specifically
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class GoServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoServerError";
  }
}
