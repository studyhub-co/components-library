// TODO we need to get sound settings for current user (on\off).

interface SoundSingletonI {
  soundFiles: { [key: string]: HTMLAudioElement };
  soundEnabled: boolean;
}

const SoundSingleton: SoundSingletonI = {
  soundFiles: {
    correct: new Audio('https://assets.physicsisbeautiful.com/curricula/audio/correct.mp3'),
    incorrect: new Audio('https://assets.physicsisbeautiful.com/curricula/audio/incorrect.mp3'),
    continue: new Audio('https://assets.physicsisbeautiful.com/curricula/audio/continue.mp3'),
    complete: new Audio('https://assets.physicsisbeautiful.com/curricula/audio/complete.mp3'),
    rainbow: new Audio('https://assets.physicsisbeautiful.com/curricula/audio/doublerainbow.mp3'),
  },
  soundEnabled: true,
};

let bgAudio: any = null;

export const playAudio = function(key: string, volume: number) {
  // volume = typeof volume !== 'undefined' ? volume : 1;
  // FIXME when we will create a PWA app, it will not be necessary?
  // if (window.IS_MOBILE_APP) {
  //   switch (key) {
  //     case 'correct':
  //       window.parent.postMessage('audioCorrect', '*');
  //       break;
  //     case 'incorrect':
  //       window.parent.postMessage('audioIncorrect', '*');
  //       break;
  //     case 'continue':
  //       window.parent.postMessage('audioContinue', '*');
  //       break;
  //     case 'complete':
  //       window.parent.postMessage('audioComplete', '*');
  //       break;
  //     case 'rainbow':
  //       window.parent.postMessage('audioDoubleRainbow', '*');
  //       break;
  //   }
  // } else if (SoundSingleton.soundEnabled) {
  const audio: any = SoundSingleton.soundFiles[key];
  audio.volume = volume;
  audio.play();
  // }
};

export const playBackgroundAudio = function(key: string, volume: number) {
  volume = typeof volume !== 'undefined' ? volume : 1;

  stopBackgroundAudio();
  if (SoundSingleton.soundEnabled) {
    bgAudio = SoundSingleton.soundFiles[key];
    bgAudio['loop'] = true;
    bgAudio['volume'] = volume;
    bgAudio.play();
  }
};

export const pauseBackgroundAudio = function() {
  if (bgAudio) {
    bgAudio.pause();
  }
};

export const unpauseBackgroundAudio = function() {
  if (bgAudio) {
    bgAudio.play();
  }
};

export const stopBackgroundAudio = function() {
  if (bgAudio) {
    bgAudio.pause();
    bgAudio = null;
  }
};
