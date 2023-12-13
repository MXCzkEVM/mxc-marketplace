import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

const twitterProvider = TwitterProvider({
  clientId: process.env.TWITTER_ID!,
  clientSecret: process.env.TWITTER_SECRET!,
  version: '2.0',
  authorization: 'https://twitter.com/i/oauth2/authorize?scope=users.read tweet.read offline.access',
})

twitterProvider.profile = function ({ data }: any) {
  console.log('profile--------------', data)
  return {
    id: data.id,
    name: data.name,
    email: data.id ||'!!!!!!!!!!!!!!!!!!!',
    image: data.profile_image_url,
  }
}
export default NextAuth({
  providers: [
    twitterProvider
  ],
  secret: 'e4c972eb07ac063727a910f072f80ab4'
});

