import { createFileSessionStorage } from "@remix-run/node";

export const sessionStorage = createFileSessionStorage({
  cookie: {
    name: "__session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: ["s3cr3t"],
    secure: process.env.NODE_ENV === "production",
  },
  dir: "/app/storedSessions"
});

export const { getSession, commitSession, destroySession } = sessionStorage;