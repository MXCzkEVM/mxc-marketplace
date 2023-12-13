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
        "https://api.twitter.com/2/users/me?user.fields=profile_image_url",
      profile({ data }) {
        return {
          id: data.id,
          name: data.name,
          email: data.email ?? null,
          image: data.profile_image_url,
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

