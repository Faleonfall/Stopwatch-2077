export interface StopwatchDigits {
  minutes: string;
  seconds: string;
  centiseconds: string;
}

function pad(value: number, length = 2) {
  return String(value).padStart(length, "0");
}

export function formatStopwatchDisplayTime(elapsed: number): StopwatchDigits {
  return {
    minutes: pad(Math.floor(elapsed / 60000)),
    seconds: pad(Math.floor((elapsed % 60000) / 1000)),
    centiseconds: pad(Math.floor((elapsed % 1000) / 10)),
  };
}

export function formatStopwatchCopyTime(elapsed: number) {
  const minutes = pad(Math.floor(elapsed / 60000));
  const seconds = pad(Math.floor((elapsed % 60000) / 1000));
  const milliseconds = pad(elapsed % 1000, 3);

  return `${minutes}:${seconds}.${milliseconds}`;
}

export function toggleLabel(isRunning: boolean) {
  return isRunning ? "Stop" : "Start";
}

// A paused reset gets its own transition key, so a digit fades even when its
// value stays the same.
export function digitKey(
  value: string,
  justReset: boolean,
  isRunning: boolean,
) {
  return justReset && !isRunning ? `${value}-reset` : value;
}

export function centisecondsKey(value: string, justReset: boolean) {
  return `${value}-${justReset ? "reset" : "idle"}`;
}
