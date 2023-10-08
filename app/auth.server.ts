import { config } from "dotenv";
import { Authenticator } from "remix-auth";
import { DiscordStrategy } from "remix-auth-discord";
import { sessionStorage } from "~/session.server";

import type { DiscordProfile, PartialDiscordGuild } from "remix-auth-discord";

interface customGuild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
  permissions: string;
}

export interface DiscordUser {
  id: DiscordProfile["id"];
  displayName: DiscordProfile["displayName"];
  avatar: DiscordProfile["__json"]["avatar"];
  discriminator: DiscordProfile["__json"]["discriminator"];
  email: DiscordProfile["__json"]["email"];
  guilds?: Array<customGuild>;
  accessToken: string;
  refreshToken?: string;
}

export const auth = new Authenticator<DiscordUser>(sessionStorage);

config();

const discordStrategy = new DiscordStrategy(
  {
    clientID: process.env.CLIENTID as string,
    clientSecret: process.env.CLIENTSECRET as string,
    callbackURL: "http://147.135.9.110:3000/auth/discord/callback",
    prompt: "consent",
    // Provide all the scopes you want as an array
    scope: ["identify", "guilds", "guilds.members.read"],
  },
  async ({
    accessToken,
    refreshToken,
    extraParams,
    profile,
  }): Promise<DiscordUser> => {
    const userGuilds: Array<PartialDiscordGuild> = await (
      await fetch("https://discord.com/api/v10/users/@me/guilds", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    )?.json()

    const guilds: Array<customGuild> = userGuilds.filter(
      (g) => g.owner || (BigInt(g.permissions) & BigInt(0x20)) == BigInt(0x20)
    ).map((rawGuild) => ({
        id: rawGuild.id,
        name: rawGuild.name,
        icon: rawGuild.icon ? rawGuild.icon : undefined,
        permissions: rawGuild.permissions,
        owner: rawGuild.owner
    }));

    return {
      id: profile.id,
      displayName: profile.__json.username,
      avatar: profile.__json.avatar,
      discriminator: profile.__json.discriminator,
      email: profile.__json.email,
      accessToken,
      guilds,
      refreshToken,
    };
  }
);

auth.use(discordStrategy);