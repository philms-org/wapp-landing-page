import { useState, type FormEvent } from "react";
import { Button } from "../ui/button";
import { EmailField } from "./EmailField";
import { RoleSelect } from "./RoleSelect";
import { isValidOrganizerRole, type OrganizerRole } from "../../lib/validation";
import { useLeadForm } from "../../lib/useLeadForm";

export function OrganizerForm() {
  const [role, setRole] = useState<OrganizerRole | "">("");
  const { email, setEmail, error, status, submit } = useLeadForm("organizer");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void submit(isValidOrganizerRole(role) ? role : null, () =>
      isValidOrganizerRole(role) ? null : "Select your role."
    );
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
