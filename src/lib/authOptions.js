// lib/authOptions.js: NextAuth config for dimenshop (Google + Credentials, single name field)
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "./mongodb";  // Singleton connection
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

async function getUserRole(email) {
  const client = await clientPromise;
  const db = client.db('dimenshopdb');  // Your DB
  const user = await db.collection('users').findOne({ email });
  return user?.role || 'user';  // Default 'user' role
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("dimenshopdb");
        const users = db.collection("users");

        const user = await users.findOne({ email: credentials.email });
        if (!user || !(await bcrypt.compare(credentials.password, user.hashedPassword))) {  // hashedPassword for security
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          name: user.name,  
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const client = await clientPromise;
        const db = client.db("dimenshopdb");
        const users = db.collection("users");

        const existingUser = await users.findOne({ email: user.email });
        if (!existingUser) {
          const fullName = user.name || 'Google User'; 
          await users.insertOne({
            name: fullName,
            email: user.email,
            image: user.image || null,
            role: "user",  // Default 
            createdAt: new Date(),
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name; 
        token.email = user.email;
        token.image = user.image;
        token.role = user.role;
      }
      if (token.email) {
        token.role = await getUserRole(token.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.role = token.role;

    
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/signup" },  // Redirect to sign-up page
};