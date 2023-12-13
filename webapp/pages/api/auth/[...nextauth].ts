import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';



export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID!,
      clientSecret: process.env.TWITTER_SECRET!,
      version: '2.0',
      profile({ data }) {
        return {
          id: data.id,
          name: data.name,
          email: data.id || 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
          image: data.profile_image_url,
        }
      },
    })
  ],
  callbacks: {
    jwt(jwt) {
      console.log('++++++++++++++++++jwt', jwt)
      return jwt.token
    },
    session(session) {
      console.log('------------------session', session)
      return session.session
    },

  },
  secret: 'e4c972eb07ac063727a910f072f80ab4'
});

