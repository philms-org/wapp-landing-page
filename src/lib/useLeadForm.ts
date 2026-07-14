import { useRef, useState } from "react";
import { buildLeadPayload, submitLead, type Track } from "./leads";
import { isValidEmail, type OrganizerRole } from "./validation";

export type LeadFormStatus = "idle" | "submitting" | "done";

export function useLeadForm(track: Track) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<LeadFormStatus>("idle");
  const submittingRef = useRef(false);

  async function submit(role: OrganizerRole | null, validateRole?: () => string | null) {
    if (submittingRef.current) return;
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    const roleError = validateRole?.();
    if (roleError) {
      setError(roleError);
      return;
    }

    setError(null);
    submittingRef.current = true;
    setStatus("submitting");
    try {
      await submitLead(buildLeadPayload(email, track, role));
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("idle");
    } finally {
      submittingRef.current = false;
    }
  }

  return { email, setEmail, error, status, submit };
}
