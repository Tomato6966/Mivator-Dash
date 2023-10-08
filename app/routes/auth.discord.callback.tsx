import type { LoaderFunction } from "@remix-run/node";
import { auth } from "~/auth.server";

export let loader: LoaderFunction = ({ request }) => {
  return auth.authenticate("discord", request, {
    successRedirect: "/guilds",
    failureRedirect: "/auth/login",
  });
};