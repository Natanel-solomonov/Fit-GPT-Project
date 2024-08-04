// src/youtube-transcript.d.ts
declare module 'youtube-transcript' {
  export function getTranscript(videoId: string): Promise<{ text: string; start: number; duration: number }[]>;
}