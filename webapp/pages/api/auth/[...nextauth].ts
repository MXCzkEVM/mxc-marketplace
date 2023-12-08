import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: '5BIzDQIxiyfwRrhEioJEKGDzI',
      clientSecret: 'SFphw6Eq2jAuKjrLTH9cweFhFlQ0WuT73eTIbzCBuqXVUF3QXL',
      version: '2.0'
    })
  ]
});