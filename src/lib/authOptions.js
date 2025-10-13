import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "./mongodb";  // MongoDB singleton connection
import bcrypt from "bcryptjs";

// Function to get a user's role from the database
// Returns 'user' if no role is found
async function getUserRole(email) {
  const client = await clientPromise;
  const db = client.db('dimenshopdb');  
  const user = await db.collection('users').findOne({ email });
  return user?.role || 'user';
}

export const authOptions = {
  providers: [
    // Google OAuth provider for social login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Credentials provider for email/password login
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

        // Look for user in the database by email
        const user = await users.findOne({ email: credentials.email });

        // If user not found or password doesn't match, throw error
        if (!user || !(await bcrypt.compare(credentials.password, user.hashedPassword))) {
          throw new Error("Invalid credentials");
        }

        // Return user object that NextAuth will store in token/session
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
    // Called on every sign-in
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const client = await clientPromise;
        const db = client.db("dimenshopdb");
        const users = db.collection("users");

        // Check if Google user already exists
        const existingUser = await users.findOne({ email: user.email });

        // If not, create new user in database with default role
        if (!existingUser) {
          const fullName = user.name || 'Google User';
          await users.insertOne({
            name: fullName,
            email: user.email,
            image: user.image || null,
            role: "user",  // default role
            createdAt: new Date(),
          });
        }
      }
      return true; // Allow sign-in
    },

    // Called whenever a JWT token is created or updated
    async jwt({ token, user }) {
      // If user object exists (initial login), store user info in token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.role = user.role;
      }

      // Always get role from DB to ensure it’s up-to-date
      if (token.email) {
        token.role = await getUserRole(token.email);
      }
      return token;
    },

    // Called when session object is created (sent to client)
    async session({ session, token }) {
      // Map JWT fields into session.user
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

  secret: process.env.NEXTAUTH_SECRET, // Used to sign JWT
  session: { strategy: "jwt" },         // Use JWT-based sessions
  pages: { signIn: "/signup" },         // Custom sign-in page
};
