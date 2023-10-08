import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { auth } from "~/auth.server";

import { redirect } from "@remix-run/node";

export let loader: LoaderFunction = () => redirect("/auth/login");

export let action: ActionFunction = ({ request }) => {
  return auth.authenticate("discord", request);
};