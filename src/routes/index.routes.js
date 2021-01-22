const { Router } = require("express");
const router = Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("Hello world");
});

router.post("/signup", passport.authenticate("signup", { session: false }), async (req, res) => {
    if(req.authInfo.ok==true){
        res.json({msg:'Signup successful', user: req.user});
    }else{
        res.json({msg: req.authInfo.msg});
    }

}
);

router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
      try {
        if (err) {
          console.log(err)
          const error = new Error('new Error')
          return next(error)
        }
        if(!user){
            return res.status(404).json({msg: 'No se encontró al usuario'});
        }
        console.log(info);
        req.login(user, { session: false }, async (err) => {
          if (err) return next(err)
          const body = { _id: user._id, email: user.email }
  
          const token = "Bearer " + jwt.sign({ user: body }, 'top_secret')
          return res.json({usuario: user, token })
        })
      }
      catch(e) {
        return next(e)
      }
    })(req, res, next)
  });

router.get('/profile', passport.authenticate('jwt',{session: false}),(req,res,next)=>{
  console.log(req);
  res.json({
    user: req.user,
    token: req.headers.authorization
  })
})
module.exports = router;
