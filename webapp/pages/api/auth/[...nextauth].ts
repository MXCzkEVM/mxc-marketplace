import NextAuth from 'next-auth';

export default NextAuth({
  providers: [
    {
      id: "twitter",
      name: "Twitter",
      type: "oauth",
      checks: ["pkce", "state"],
      authorization:
        "https://twitter.com/i/oauth2/authorize?scope=users.read tweet.read offline.access",
      token: "https://api.twitter.com/2/oauth2/token",
      userinfo:
        "https://api.twitter.com/2/users/me?user.fields=?user.fields=id,name,username,profile_image_url",
      clientId: process.env.TWITTER_ID!,
      clientSecret: process.env.TWITTER_SECRET!,
      profile({ data }) {
        return {
          id: '----------------------------------------------',
          name: '----------------------------------------------',
          email: '----------------------------------------------' ?? null,
          image: '----------------------------------------------',
        }
      },
    }
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

