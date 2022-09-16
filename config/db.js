const mongoose = require("mongoose");

const mongoConnection = async () => {
    const connection = await mongoose.connect(process.env.URI);

    console.log("DB-Connection-Made-Successfully");
}

module.exports = {
    mongoConnection
};