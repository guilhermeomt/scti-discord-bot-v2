import { VoiceState } from 'discord.js';
import { RunFunction } from '../interfaces/RunFunction';
import { eventManager } from '../models/EventManager';
import { notion } from '../models/Notion';

export const run: RunFunction = async (client, oldState: VoiceState, newState: VoiceState) => {
  const oldUserChannel = oldState.channelId;
  const newUserChannel = newState.channelId;

  const talk = eventManager.findTalkByRoomsChannelId(newUserChannel);

  if (!talk) return;

  const userEntered = newUserChannel && !oldUserChannel;
  const userMoved =
    newUserChannel && oldUserChannel && newUserChannel !== oldUserChannel;

  if (userEntered || userMoved) {
    const { user } = newState.member;

    const isParticipant = newState.member.roles.cache.some((role) => role.id === process.env.PARTICIPANT_ROLE_ID);

    // if (!isParticipant
    //   || eventManager.isPresenceConfirmed(user.id)) {
    //   return;
    // }

    const presence = await notion.confirmPresence(talk.notionId, user.id);
  }
}

export const name: string = 'voiceStateUpdate';
