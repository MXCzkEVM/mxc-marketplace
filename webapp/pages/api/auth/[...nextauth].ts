import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';


const twitterProvider = TwitterProvider({
  clientId: process.env.TWITTER_ID!,
  clientSecret: process.env.TWITTER_SECRET!,
  version: '2.0',
})
twitterProvider.profile = function ({data}: any) {
  return {
    id: data.id,
    name: '-------------------------------------------',
    email: '-------------------------------------------',
    image: '-------------------------------------------',
  }
}
export default NextAuth({
  providers: [
    twitterProvider
  ],
  callbacks: {
    jwt(jwt) {
      console.log('++++++++++++++++++jwt', jwt)
      return jwt.token
    },
    session(session) {
      console.log('------------------jwt', session)
      return session.session
    },

  },
  secret: 'e4c972eb07ac063727a910f072f80ab4'
});

