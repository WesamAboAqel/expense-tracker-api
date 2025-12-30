import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

type googleUser = {
    google_id: string;
    name: string;
    username: string;
};

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: "http://localhost:3000/api/auth/google/callback",
        },
        function (
            accessToken: string,
            refreshToken: string,
            profile: any,
            cb: Function
        ) {
            // console.log("Passport");
            return cb(null, {
                google_id: profile.id,
                name: `${profile.name.givenName} ${profile.name.familyName}`,
                username: profile.emails[0].value.split("@")[0],
            });
        }
    )
);
