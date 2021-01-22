const { model, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.pre("save", function (next) {
  var user = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, (err, hash)=>{
          if(err){
              return next(err);
          }
          user.password = hash;
          next();
      });
    });
  }else{
      return next();
  }
});

UserSchema.methods.validatePassword = async function(password){
    console.log("Entra "+password+" compara con "+ this.password);
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
  };

module.exports = model('User', UserSchema);
