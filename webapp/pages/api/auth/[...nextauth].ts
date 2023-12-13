import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID!,
      clientSecret: process.env.TWITTER_SECRET!,
      version: '2.0',
    })
  ],
  callbacks: {
    session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (session && session.user)
        // @ts-expect-error
        session.user.id = token?.id || user?.id
      
      return session
    },
  },
  secret: 'e4c972eb07ac063727a910f072f80ab4'
});

