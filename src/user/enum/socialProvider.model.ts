export const socialProvider = {
  KAKAO: 'kakao',
  LOCAL: 'local',
} as const;

export type SocialProvider =
  (typeof socialProvider)[keyof typeof socialProvider];
