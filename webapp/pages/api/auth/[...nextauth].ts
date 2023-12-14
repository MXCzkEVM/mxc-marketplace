import NextAuth from 'next-auth';

const USER_INFO_URL = "https://api.twitter.com/2/users/me?user.fields=?user.fields=id,name,username,profile_image_url"
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
      userinfo: {
        url: USER_INFO_URL,
        async request({ tokens }) {
          const response = await fetch(USER_INFO_URL, {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          })
          return response.json()
        },
      },
      clientId: process.env.TWITTER_ID!,
      clientSecret: process.env.TWITTER_SECRET!,
      profile({ data }) {
        return {
          id: data.id,
          name: data.name,
          email: data.id,
          image: '--------------------------',
        }
      },
    }
  ],
  secret: 'e4c972eb07ac063727a910f072f80ab4'
});

