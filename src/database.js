const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/apipassportjwt',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(db=>{console.log('DB is connected')}).catch(err=>console.log(err));