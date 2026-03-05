const passport = require("passport");
const bcrypt = require("bcryptjs");
const db = require("../db/authModel");
const crypto = require("crypto");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// Passport local strategy
passport.use(
    new LocalStrategy(
        { usernameField: "email", passReqToCallback: true },
        async (req, email, password, done) => {
            try {
                const user = await db.getUserByEmail(email);
                req.user = user;

                if (!user) {
                    return done(null, false, {
                        error: "Incorrect email",
                    });
                }

                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return done(null, false, {
                        error: "Incorrect password",
                    });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        },
    ),
);

// Passport JWT Strategy
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        async (payload, done) => {
            try {
                const user = await db.getUserById(payload.userId);
                if (user) return done(null, user);
                return done(null, false);
            } catch (err) {
                return done(err, false);
            }
        },
    ),
);

// Google OAuth2 Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URI,
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const user = await db.getUserByEmail(email);
                const profilePicture = profile.photos?.[0]?.value;

                const randomPassword = crypto
                    .randomBytes(Math.ceil(32 / 2))
                    .toString("hex")
                    .slice(0, 32);
                const saltedPassword = await bcrypt.hash(randomPassword, 12);
                if (!user) {
                    const newUser = await db.createUser(
                        profile.displayName,
                        email,
                        saltedPassword,
                        null, // role
                        profilePicture,
                    );
                    return done(null, newUser);
                }

                return done(null, user);
            } catch (err) {
                console.error("Google auth err: ", err);
                return done(err, false);
            }
        },
    ),
);

module.exports = passport;
