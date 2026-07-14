import type { FormEvent } from "react";
import { Button } from "../ui/button";
import { EmailField } from "./EmailField";
import { useLeadForm } from "../../lib/useLeadForm";

export function AttendeeForm() {
  const { email, setEmail, error, status, submit } = useLeadForm("attendee");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void submit(null);
  }

  if (status === "done") {
    return <p className="text-cyan-700">Thanks — we'll be in touch.</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-sm flex-col gap-3">
      <EmailField value={email} onChange={setEmail} error={error} />
      <Button type="submit" disabled={status === "submitting"}>
        Get early access
      </Button>
    </form>
  );
}
