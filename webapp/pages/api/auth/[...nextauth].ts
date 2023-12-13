import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: '6DTomBZrd38kp8XT918fSPot8',
      clientSecret: 'hP9pVz1SUs0EIeziPdvqSxoW6bJ7irOr2hEwMuTjXVRMIMc7A7',
      version: '2.0',
    })
  ],
  secret: 'e4c972eb07ac063727a910f072f80ab4'
});

