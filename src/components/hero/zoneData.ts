export type ZoneId = "who" | "qr-connect" | "live-feed" | "rewards";

export interface ZoneDef {
  id: ZoneId;
  title: string;
  reveal: string | null;
  caption: string;
}

export const ZONES: ZoneDef[] = [
  { id: "who", title: "Who", reveal: null, caption: "See who's already in the room" },
  {
    id: "qr-connect",
    title: "Where",
    reveal: "QR Connect",
    caption: "As attendees move around they get alerts — this data helps improve the experience",
  },
  {
    id: "live-feed",
    title: "What",
    reveal: "Live Feed",
    caption: "Post and see what's happening live",
  },
  {
    id: "rewards",
    title: "Why",
    reveal: "Rewards",
    caption: "Attendees unlock perks as they engage with the event and sponsors",
  },
];
