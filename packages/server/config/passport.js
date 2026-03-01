const passport = require("passport");
const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const crypto = require("crypto");
const LocalStrategy = require("passport-local").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
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
                const user = await db.getUserByID(payload.userId);
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            } catch (err) {
                return done(err, false);
            }
        },
    ),
);

// Github OAuth2 Strategy
passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "https://project-odin-book-dime.onrender.com/api/auth/github/callback",
            scope: ["user:email"],
            customLogic: async (accessToken, profile) => {
                const emailsResponse = await require("axios").get(
                    "https://api.github.com/user/emails",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    },
                );
                const primaryEmail = emailsResponse.data.find(
                    (email) => email.primary,
                )?.email;
                profile.emails = [{ value: primaryEmail }];
            },
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const user = await db.getUserByEmail(email);
                const profilePicture = profile._json.avatar_url;
                const randomPassword = crypto
                    .randomBytes(Math.ceil(32 / 2))
                    .toString("hex")
                    .slice(0, 32);
                const saltedPassword = await bcrypt.hash(randomPassword, 12);
                if (!user) {
                    const user = await db.createUser(
                        profile.displayName,
                        email,
                        saltedPassword,
                        (bio = null),
                        profilePicture,
                    );
                    return done(null, user);
                }

                return done(null, user);
            } catch (err) {
                console.error("Github auth err: ", err);
                return done(err, false);
            }
        },
    ),
);

module.exports = passport;