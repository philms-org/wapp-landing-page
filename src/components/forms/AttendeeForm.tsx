import { useState, type FormEvent } from "react";
import { Button } from "../ui/button";
import { EmailField } from "./EmailField";
import { isValidEmail } from "../../lib/validation";
import { buildLeadPayload, submitLead } from "../../lib/leads";

export function AttendeeForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setStatus("submitting");
    try {
      await submitLead(buildLeadPayload(email, "attendee", null));
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return <p className="text-cyan-400">Thanks — we'll be in touch.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3">
      <EmailField value={email} onChange={setEmail} error={error} />
      <Button type="submit" disabled={status === "submitting"}>
        Get early access
      </Button>
    </form>
  );
}
