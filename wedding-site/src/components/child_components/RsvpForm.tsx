import React, { useState } from "react";
import { Family, FamilyMember } from "../../types";

type RsvpState =
  | { status: "idle" | "not_found" | "error" | "loading" }
  | { status: "success"; family: Family };

type GuestDetail = {
  songRequest: string;
  emailAddress: string;
  isPlusOne: boolean;
  plusOneFirstName?: string;
  plusOneLastName?: string;
};

function RsvpAnswerForm({
  guests,
  familyId,
}: {
  guests: FamilyMember[];
  familyId: number;
}) {
  const [answers, setAnswers] = useState<Record<number, 3 | 2>>({});
  const [stage, setStage] = useState<"answers" | "details" | "done">("answers");
  const [details, setDetails] = useState<Record<string, GuestDetail>>({});
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0);
  const [attendingGuests, setAttendingGuests] = useState<FamilyMember[]>([]);
  const [emailError, setEmailError] = useState("");

  const setAnswer = (id: number, value: 3 | 2) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const answeredCount = Object.keys(answers).length;
  const allAnswered =
    guests.length > 0 && guests.every((g) => !!answers[g.guestId]);

  const currentMember = attendingGuests[currentDetailIndex] ?? null;
  const currentMemberDetails: GuestDetail | null = currentMember
    ? (details[currentMember.guestId] ?? {
        songRequest: "",
        emailAddress: "",
        isPlusOne: currentMember.isPlusOne,
        plusOneFirstName: "",
        plusOneLastName: "",
      })
    : null;
  const isLastGuest = currentDetailIndex === attendingGuests.length - 1;

  const submitAllResponses = async (
    detailsData: Record<string, GuestDetail>,
  ) => {
    const payload = guests.map((g) => ({
      guestId: g.guestId,
      answer: answers[g.guestId] ?? 2,
      songRequest: detailsData[g.guestId]?.songRequest ?? "",
      emailAddress: detailsData[g.guestId]?.emailAddress ?? "",
      isPlusOne: detailsData[g.guestId]?.isPlusOne ?? false,
      plusOneFirstName: detailsData[g.guestId]?.plusOneFirstName ?? null,
      plusOneLastName: detailsData[g.guestId]?.plusOneLastName ?? null,
    }));

    await fetch("/api/rsvp/guestsResponse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ familyId, responses: payload }),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered) return;

    const attending = guests.filter((g) => answers[g.guestId] === 3);
    if (attending.length === 0) {
      await submitAllResponses({});
      setStage("done");
      return;
    }

    const initialDetails: Record<string, GuestDetail> = {};
    attending.forEach((g) => {
      initialDetails[g.guestId] = {
        songRequest: g.songRequest ?? "",
        emailAddress: g.emailAddress ?? "",
        isPlusOne: g.isPlusOne,
        plusOneFirstName: g.isPlusOne ? g.firstName : undefined,
        plusOneLastName: g.isPlusOne ? g.lastName : undefined,
      };
    });
    setAttendingGuests(attending);
    setDetails(initialDetails);
    setCurrentDetailIndex(0);
    setStage("details");
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitAllResponses(details);
    setStage("done");
  };

  const updateDetail = (guestId: number, field: string, value: string) => {
    if (field === "emailAddress") setEmailError("");
    setDetails((prev) => ({
      ...prev,
      [guestId]: { ...prev[guestId], [field]: value },
    }));
  };

  const validateCurrentEmail = (): boolean => {
    const email = currentMemberDetails?.emailAddress ?? "";
    if (email === "") return true;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) setEmailError("Please enter a valid email address.");
    return valid;
  };

  return (
    <>
      <label className="section-eyebrow">
        Please let us know who will be attending from your family!
      </label>

      <form
        className="rsvp__form"
        onSubmit={stage === "answers" ? handleSubmit : handleFinalSubmit}
      >
        {stage === "answers" && (
          <>
            <div className="rsvp__form__flex">
              <div className="rsvp__form__guests">
                {guests.map((member) => (
                  <div key={member.guestId} className="guest-row">
                    <div className="guest-name">
                      {member.firstName} {member.lastName}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rsvp__form__toggles">
                {guests.map((member) => (
                  <div
                    key={member.guestId}
                    className="rsvp__toggle-group"
                    role="group"
                    aria-label={`Attendance for ${member.firstName}`}
                  >
                    <button
                      type="button"
                      className={`rsvp__toggle ${answers[member.guestId] === 3 ? "active" : ""}`}
                      onClick={() => setAnswer(member.guestId, 3)}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className={`rsvp__toggle ${answers[member.guestId] === 2 ? "active" : ""}`}
                      onClick={() => setAnswer(member.guestId, 2)}
                    >
                      No
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rsvp__warning">
              {!allAnswered &&
                `Please select "Yes" or "No" for every guest (${answeredCount}/${guests.length}).`}
            </div>

            <button
              type="submit"
              className="rsvp__submit"
              disabled={!allAnswered}
            >
              Continue
            </button>
          </>
        )}

        {stage === "details" && currentMember && currentMemberDetails && (
          <>
            <div className="rsvp__details-header">
              <p className="section-eyebrow">
                Guest {currentDetailIndex + 1} of {attendingGuests.length}
              </p>
              <h3 className="rsvp__details-name">
                {currentMember.isPlusOne
                  ? "A little more about your plus-one"
                  : `A little more about ${currentMember.firstName}`}
              </h3>
            </div>

            <div className="rsvp__fields">
              <div className="rsvp__field">
                <label>Email address</label>
                <input
                  type="email"
                  value={currentMemberDetails.emailAddress}
                  onChange={(e) =>
                    updateDetail(
                      currentMember.guestId,
                      "emailAddress",
                      e.target.value,
                    )
                  }
                />
                {emailError && (
                  <span className="rsvp__field-error">{emailError}</span>
                )}
              </div>

              <div className="rsvp__field">
                <label>Song request</label>
                <input
                  type="text"
                  value={currentMemberDetails.songRequest}
                  onChange={(e) =>
                    updateDetail(
                      currentMember.guestId,
                      "songRequest",
                      e.target.value,
                    )
                  }
                />
              </div>

              {currentMember.isPlusOne && (
                <>
                  <div className="rsvp__field">
                    <label>First name</label>
                    <input
                      type="text"
                      value={currentMemberDetails.plusOneFirstName || ""}
                      onChange={(e) =>
                        updateDetail(
                          currentMember.guestId,
                          "plusOneFirstName",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="rsvp__field">
                    <label>Last name</label>
                    <input
                      type="text"
                      value={currentMemberDetails.plusOneLastName || ""}
                      onChange={(e) =>
                        updateDetail(
                          currentMember.guestId,
                          "plusOneLastName",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </>
              )}
            </div>

            <div className="rsvp__details-nav">
              <button
                type="button"
                className="rsvp__back"
                onClick={() => {
                  if (currentDetailIndex === 0) return setStage("answers");
                  setCurrentDetailIndex((i) => Math.max(0, i - 1));
                }}
              >
                ← Back
              </button>

              {!isLastGuest ? (
                <button
                  type="button"
                  className="rsvp__submit"
                  onClick={() => {
                    if (!validateCurrentEmail()) return;
                    setCurrentDetailIndex((i) =>
                      Math.min(attendingGuests.length - 1, i + 1),
                    );
                  }}
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  className="rsvp__submit"
                  onClick={async () => {
                    if (!validateCurrentEmail()) return;
                    await submitAllResponses(details);
                    setStage("done");
                  }}
                >
                  Submit RSVP
                </button>
              )}
            </div>
          </>
        )}

        {stage === "done" && (
          <div className="rsvp__thanks">
            <p className="section-eyebrow">RSVP confirmed</p>
            <h2 className="rsvp__thanks-title">Thanks — we'll see you there</h2>
            <p className="rsvp__thanks-text">
              Your response has been saved. We'll be in touch as the day
              approaches.
            </p>
          </div>
        )}
      </form>
    </>
  );
}

function statusLabel(status: FamilyMember["rsvpStatus"]) {
  if (status === "Accepted") return "Attending ✓";
  if (status === "Declined") return "Not attending";
  return "Pending";
}

function AlreadyRespondedView({
  family,
  onUpdate,
  onReset,
}: {
  family: Family;
  onUpdate: () => void;
  onReset: () => void;
}) {
  return (
    <div className="rsvp__responded">
      <p className="section-eyebrow">Welcome back</p>
      <h2 className="rsvp__responded-title">{family.familyName} family</h2>
      <p className="rsvp__responded-sub">
        We already have your RSVP on file — thank you!
      </p>

      <ul className="rsvp__responded-list">
        {family.familyMembers.map((m) => (
          <li key={m.guestId} className="rsvp__responded-row">
            <span className="rsvp__responded-name">
              {m.firstName} {m.lastName} {m.isPlusOne && "(plus-one)"}
            </span>
            <span
              className={`rsvp__responded-status rsvp__responded-status--${(m.rsvpStatus ?? "pending").toLowerCase()}`}
            >
              {statusLabel(m.rsvpStatus)}
            </span>
          </li>
        ))}
      </ul>

      <button className="rsvp__submit" onClick={onUpdate}>
        Update Response
      </button>
      <button type="button" className="rsvp__back__reset" onClick={onReset}>
        Not you?
      </button>
    </div>
  );
}

function RsvpFamilyForm({
  family,
  onReset,
}: {
  family: Family;
  onReset: () => void;
}) {
  const [started, setStarted] = useState(false);
  const [updating, setUpdating] = useState(false);

  if (family.hasResponded && !updating) {
    return (
      <AlreadyRespondedView
        family={family}
        onReset={onReset}
        onUpdate={() => {
          setUpdating(true);
          setStarted(true);
        }}
      />
    );
  }

  return (
    <>
      {!started ? (
        <>
          <p className="section-eyebrow">
            Welcome, {family.familyName} family!
          </p>
          {family.familyMembers.map((member) => (
            <div key={member.guestId} className="guest-name">
              {member.isPlusOne
                ? "Plus-one"
                : `${member.firstName} ${member.lastName}`}
            </div>
          ))}
          <button
            className="rsvp__submit"
            style={{ marginTop: "1.5rem" }}
            onClick={() => setStarted(true)}
          >
            Begin RSVP
          </button>
          <button type="button" className="rsvp__back__reset" onClick={onReset}>
            Not you?
          </button>
        </>
      ) : (
        <RsvpAnswerForm
          guests={family.familyMembers}
          familyId={family.familyId}
        />
      )}
    </>
  );
}

function EnterRsvpCode({
  handleCodeSubmit,
  inputCode,
  setInputCode,
}: {
  handleCodeSubmit: (e: React.FormEvent) => void;
  inputCode: string;
  setInputCode: (code: string) => void;
}) {
  return (
    <form className="rsvp__form" onSubmit={handleCodeSubmit}>
      <div className="rsvp__fields">
        <div className="rsvp__field">
          <label>RSVP Code</label>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
        </div>
      </div>
      <button
        type="submit"
        className="rsvp__submit"
        disabled={!inputCode.trim()}
      >
        Continue
      </button>
    </form>
  );
}

function RsvpCodeNotFound({
  handleCodeSubmit,
  inputCode,
  setInputCode,
}: {
  handleCodeSubmit: (e: React.FormEvent) => void;
  inputCode: string;
  setInputCode: (code: string) => void;
}) {
  return (
    <>
      <p style={{ color: "red" }}>
        That code wasn't found. Please double-check your invitation.
      </p>
      <EnterRsvpCode
        handleCodeSubmit={handleCodeSubmit}
        inputCode={inputCode}
        setInputCode={setInputCode}
      />
    </>
  );
}

export default function RsvpForm(props: {
  state: RsvpState;
  handleCodeSubmit: (e: React.FormEvent) => void;
  inputCode: string;
  setInputCode: (code: string) => void;
  onReset: () => void;
}) {
  const { state, handleCodeSubmit, inputCode, setInputCode, onReset } = props;

  return (
    <section id="rsvp" className="rsvp">
      <div className="rsvpBackground" />
      <div className="rsvp__container">
        <h1 className="section-title">RSVP</h1>

        {state.status === "loading" ? (
          <div>Loading...</div>
        ) : state.status === "success" ? (
          <RsvpFamilyForm family={state.family} onReset={onReset} />
        ) : state.status === "not_found" ? (
          <RsvpCodeNotFound
            handleCodeSubmit={handleCodeSubmit}
            inputCode={inputCode}
            setInputCode={setInputCode}
          />
        ) : state.status === "error" ? (
          <>
            <p style={{ color: "red" }}>
              Something went wrong. Please try again in a moment.
            </p>
            <EnterRsvpCode
              handleCodeSubmit={handleCodeSubmit}
              inputCode={inputCode}
              setInputCode={setInputCode}
            />
          </>
        ) : (
          <EnterRsvpCode
            handleCodeSubmit={handleCodeSubmit}
            inputCode={inputCode}
            setInputCode={setInputCode}
          />
        )}
      </div>
    </section>
  );
}
