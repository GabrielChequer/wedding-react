export interface FamilyMember {
  guestId: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  songRequest: string;
  isPlusOne: boolean;
  rsvpStatus?: "Pending" | "Declined" | "Accepted";
}

export interface Family {
  familyId: number;
  familyName: string;
  isTraveling: boolean;
  mailingAddr: string;
  invitationCode: string;
  hasResponded: boolean;
  familyMembers: FamilyMember[];
}
