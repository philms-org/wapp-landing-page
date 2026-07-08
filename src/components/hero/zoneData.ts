export type ZoneId = "who" | "qr-connect" | "live-feed" | "rewards";

export interface ZoneDef {
  id: ZoneId;
  title: string;
  valueProp: string;
}

export const ZONES: ZoneDef[] = [
  { id: "who", title: "WHO", valueProp: "See who's already in the room" },
  { id: "qr-connect", title: "QR Connect", valueProp: "Trade contacts in one tap" },
  { id: "live-feed", title: "Live Feed", valueProp: "Post and see what's happening live" },
  { id: "rewards", title: "Rewards", valueProp: "Unlock perks as you engage" },
];
