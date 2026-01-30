const { options } = require("joi");
const mongoose = require("mongoose");

uri = "mongodb+srv://antrikshitiz_db_user:<r7fY5lZjVJcZM6A6>@buildtronicsapi.zmnp10l.mongodb.net/antrikshitiz_db_user?appName=BuildtronicsAPI";
";


function connectDB() {
    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

module.exports = connectDB;
