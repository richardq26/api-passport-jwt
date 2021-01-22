const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/User");

const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;


//done(error, usuario, opciones extra)
passport.use("signup", new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        User.findOne({ email }, async (err, usuarioencontrado) => {
          if (err) {
            return done(err, false);
          }
          if (usuarioencontrado) {
            return done(null, usuarioencontrado, { ok: false, msg: "Usuario repetido" });
          } else {
            const newuser = new User({ email, password });
            await newuser.save((err, nuevous)=>{
              if(err){
                //done(error, usuario, opciones extra)
                done(err);
              }
              if(!nuevous){
                return done(null, false, {ok:'erroralcrear',msg: "No se pudo crear al usuario"});
              }
              return done(null, newuser,{ok:true});
            });
          }
        });
      } catch (e) {
        return done(e);
      }
    }
  )
);

passport.use('login', new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        
        const user = await User.findOne({ email });
        
        if (!user) {
          return done(null, false, { ok: false, msg: "User not found" });
        }
        const valido = await user.validatePassword(password);
        if (!valido) {
          return res.status(400).json({ ok: false, msg: "Clave incorrecta" });
        }
        return done(null, user,{ok: true});
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(new JWTStrategy({
  secretOrKey: 'top_secret',
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()}, async(token, done)=>{
    try {
      if(!token.user){
        return done(null, false, {ok: false, msg:'No existe un usuario para este token'});
      }
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  }
));
