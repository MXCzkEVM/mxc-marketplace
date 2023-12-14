import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';



export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID!,
      clientSecret: process.env.TWITTER_SECRET!,
      version: '2.0',
      userinfo: 'https://api.twitter.com/2/users/me?user.fields=id,username,profile_image_url',
      profile(profile) {
        return {
          id: profile.data.id,
          name: profile.data.username,
          email: profile.data.email ?? null,
          image: profile.data.profile_image_url,
        }
      },
    })
  ],
  secret: 'e4c972eb07ac063727a910f072f80ab4'
});

