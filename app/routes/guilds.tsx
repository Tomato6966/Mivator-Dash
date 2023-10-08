import type { LoaderFunction } from "@remix-run/node";
import { auth } from "~/auth.server";

import { useLoaderData } from "@remix-run/react";

import { guildIcon, userAvatar } from "../../utils/DiscordUtils";

import type { DiscordUser } from "~/auth.server";
export let loader: LoaderFunction = async ({ request }) => {
  return await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });
};

export default function DashboardPage() {
  const user = useLoaderData<DiscordUser>();
  return (
    <div>
      <h1>Dashboard</h1>
      <h2>
        Welcome {user.displayName}
        <img src={userAvatar(user.id, user.avatar)} width={64} height={64}></img>
        {user.guilds.map(guild => {
          return <div>{guild.name} <img src={guildIcon(guild.id, guild.icon)}></img></div>
        })}
      </h2>
    </div>
  );
}