import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID!,
      clientSecret: process.env.TWITTER_SECRET!,
      version: '2.0',
      profile(data) {
        return {
          id: data.id_str,
          name: data.screen_name, // this is the Twitter username
          email: data.email,
          image: data.profile_image_url_https.replace(/_normal\.(jpg|png|gif)$/, '.$1') as string,
        };
      },
    })
  ],
  secret: 'e4c972eb07ac063727a910f072f80ab4'
});

