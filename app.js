require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const expres_graph = require("express-graphql").graphqlHTTP;

const schema = require("./schema/schema");
const { mongoConnection } = require("./config/db");


var root = {
    hello: () => {
        return 'Hello world!';
    },
};

app.use("/graphql", expres_graph({
    graphiql: process.env.NODE_ENV == "development" ? true : false,
    rootValue: root,
    schema: schema //replace with new schema
}))


app.listen(PORT, async () => {
    console.log(`Working on ${PORT}`);
    await mongoConnection();
})
