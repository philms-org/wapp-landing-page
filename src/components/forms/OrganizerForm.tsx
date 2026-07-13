import { useState, type FormEvent } from "react";
import { Button } from "../ui/button";
import { EmailField } from "./EmailField";
import { RoleSelect } from "./RoleSelect";
import { isValidEmail, isValidOrganizerRole, type OrganizerRole } from "../../lib/validation";
import { buildLeadPayload, submitLead } from "../../lib/leads";

export function OrganizerForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<OrganizerRole | "">("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!isValidOrganizerRole(role)) {
      setError("Select your role.");
      return;
    }
    setError(null);
    setStatus("submitting");
    try {
      await submitLead(buildLeadPayload(email, "organizer", role));
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return <p className="text-cyan-700">Thanks — we'll be in touch.</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-sm flex-col gap-3">
      <EmailField value={email} onChange={setEmail} error={error} />
      <RoleSelect value={role} onChange={setRole} />
      <Button type="submit" disabled={status === "submitting"}>
        Talk to us about your event
      </Button>
    </form>
  );
}
