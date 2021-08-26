import { Collection, GuildMember, Invite } from 'discord.js';
import { RunFunction } from '../interfaces/RunFunction';

export const run: RunFunction = async (client, member: GuildMember) => {
  const invites: Collection<string, Invite> = client.invites;

  const guildInvites = await member.guild.invites.fetch();

  const invite = guildInvites.find(
    (inv) => invites?.get(inv.code)?.uses < inv.uses
  );

  if (invite?.code === process.env.PARTICIPANT_ROLE_CODE) {
    member.roles.add(
      member.guild?.roles?.cache?.find(
        (role) => role?.name === process.env.PARTICIPANT_ROLE_NAME
      )
    );
  }
  if (invite?.code === process.env.SPEAKER_ROLE_CODE) {
    member.roles.add(
      member.guild?.roles?.cache?.find(
        (role) => role?.name === process.env.SPEAKER_ROLE_NAME
      )
    );
  }
};

export const name: string = 'guildMemberAdd';
