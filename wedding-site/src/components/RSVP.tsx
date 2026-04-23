import { useState } from "react";
import "./RSVP.css";
import { useRSVP } from "./hooks/useRSVP";
import RsvpForm from "./child_components/RsvpForm";

type RSVPProps = {
  rsvpCode: string | null;
};

export default function RSVP({ rsvpCode }: RSVPProps) {
  const { state, lookup, reset } = useRSVP(rsvpCode);
  const [inputCode, setInputCode] = useState("");

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) lookup(inputCode);
  };

  const handleReset = () => {
    reset();
    setInputCode("");
  };

  return (
    <RsvpForm
      state={state}
      handleCodeSubmit={handleCodeSubmit}
      inputCode={inputCode}
      setInputCode={setInputCode}
      onReset={handleReset}
    />
  );
}
