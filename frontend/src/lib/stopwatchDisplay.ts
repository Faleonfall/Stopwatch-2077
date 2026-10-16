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

export interface DigitFades {
  minutes: boolean;
  seconds: boolean;
  centiseconds: boolean;
}

// A reset mid-run snaps every digit to zero. Otherwise minutes and seconds
// fade, and centiseconds fade only while paused since they tick too fast.
export function digitFades(isRunning: boolean, justReset: boolean): DigitFades {
  const snaps = isRunning && justReset;

  return {
    minutes: !snaps,
    seconds: !snaps,
    centiseconds: !isRunning,
  };
}

// A fading digit waits for the old one to leave. A snapping digit swaps at
// once, since out-in would re-render it on every tick.
export function digitTransitionMode(fade: boolean) {
  return fade ? "out-in" : "default";
}

// A reset mid-run remounts the digits, so one still fading out is dropped at
// once instead of holding back the zeros.
export function displayKey(isRunning: boolean, justReset: boolean) {
  return isRunning && justReset ? "snap" : "live";
}
