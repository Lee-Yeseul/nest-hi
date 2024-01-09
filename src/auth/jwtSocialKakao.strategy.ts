// import { Injectable, Logger } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { VerifyCallback } from 'jsonwebtoken';
// import { Strategy } from 'passport-kakao';

// // const KAKAO_APP_KEY = 'e657289067a8de5b5e1241001a93795f';
// const KAKAO_REST_API_KEY = '103e9d26733b5df6fd03cf908e29787d';
// const KAKAO_REDIRECT_URL = 'http://localhost:3000/auth/kakao';
// const KAKAO_CLIENT_SECRET = 'JNs1890go5Q43kzM5sO83O9VhPS58KQo';

// @Injectable()
// export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
//   constructor() {
//     super({
//       clientID: KAKAO_REST_API_KEY,
//       clientSecret: KAKAO_CLIENT_SECRET,
//       callbackURL: KAKAO_REDIRECT_URL,
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ): Promise<any> {
//     try {
//       // 사용자 정보를 가지고 로직을 수행
//       const user = {
//         id: profile.id,
//         email: profile._json && profile._json.kakao_account.email,
//         name: profile.displayName,
//       };
//       console.log(user);
//       return done(null, user);
//     } catch (error) {
//       Logger.log(`error ${error.message}`);
//     }
//   }
// }
