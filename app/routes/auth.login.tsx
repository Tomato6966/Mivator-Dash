import { LoaderFunction } from "react-router";

import { Form } from "@remix-run/react";

import { auth } from "../auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  return await auth.isAuthenticated(request, { successRedirect: "/guilds" });
};

export default function Login() {
  return (
    <Form action="/auth/discord" method="post">
      <button>Login with Discord</button>
    </Form>
  );
}