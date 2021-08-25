import { VoiceState } from 'discord.js';
import { RunFunction } from '../interfaces/RunFunction';
import { talkManager } from '../models/TalkManager';
import { notion } from '../models/Notion';

export const run: RunFunction = async (client, oldState: VoiceState, newState: VoiceState) => {
  const oldUserChannel = oldState.channelID;
  const newUserChannel = newState.channelID;

  const talk = talkManager.findTalkByRoomsChannelId(newUserChannel);

  if (!talk) return;

  const userEntered = newUserChannel && !oldUserChannel;
  const userMoved =
    newUserChannel && oldUserChannel && newUserChannel !== oldUserChannel;

  if (userEntered || userMoved) {
    const { user } = newState.member;

    const isParticipant = newState.member.roles.cache.some((role) => role.id === process.env.PARTICIPANT_ROLE_ID);

    // if (!isParticipant
    //   || talkManager.isPresenceConfirmed(user.id)) {
    //   return;
    // }

    const presence = await notion.confirmPresence(talk.notionId, user.id);
  }
}

export const name: string = 'voiceStateUpdate';
