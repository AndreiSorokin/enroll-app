import passport from "passport";
import GoogleTokenStrategy from "passport-google-id-token";
import { User } from "../models";
import bcrypt from "bcrypt";

const googleAuthStrategy = new GoogleTokenStrategy(
   {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
   },
   async (parsedToken: any, googleId: string, done: any) => {
      try {
         const { email, name, picture } = parsedToken.payload;

         if (!email) {
            console.error("Google token missing email!");
            return done(null, false, { message: "No email found in Google token" });
         }

         let user = await User.findOne({ where: { email } });

         if (!user) {
            const saltRound = 10;
            const defaultPassword = `google_${new Date().getTime()}`;
            const hashedPassword = await bcrypt.hash(defaultPassword, saltRound);

            user = await User.create({
               email,
               name,
               googleId,
               password: hashedPassword,
               role: "user",
               active: true,
               image: picture,
            });
         }

         return done(null, user);
      } catch (error) {
         console.error("Error processing Google token:", error);
         return done(error, false, { message: "Error processing Google token" });
      }
   }
);

passport.use(googleAuthStrategy);
export default passport;