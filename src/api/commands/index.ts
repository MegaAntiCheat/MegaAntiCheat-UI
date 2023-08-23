import { COMMAND_ENDPOINT } from '@api/globals';

async function execCommand(command: string, value: unknown) {
  const formBody = {
    commands: {
      [command]: value,
    },
  };

  const options = {
    method: 'POST',
    body: JSON.stringify(formBody),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(`${COMMAND_ENDPOINT}`, options);

  return response;
}

async function sendToChat(message: string) {
  try {
    const response = await execCommand('say', message);

    if (!response.ok) throw new Error('Failed to send Message');
  } catch (e) {
    console.error(e);
  }
}

async function sendToTeam(message: string) {
  try {
    const response = await execCommand('sayTeam', message);

    if (!response.ok) throw new Error('Failed to send Message to Team');
  } catch (e) {
    console.error(e);
  }
}

async function kickPlayer(userID: string, reason: string) {
  try {
    const response = await execCommand('kick', { player: userID, reason });

    if (!response.ok) throw new Error('Failed to initiate votekick');
  } catch (e) {
    console.error(e);
  }
}

async function executeCustomCommand(command: string, value: unknown) {
  try {
    const response = await execCommand('custom', `${command} ${value}`);

    if (!response.ok) throw new Error(`Failed to execute ${command}`);
  } catch (e) {
    console.error(e);
  }
}

export { sendToChat, sendToTeam, kickPlayer, executeCustomCommand };
