const express = require("express");
const expressGraphQL = require("express-graphql");
const server = express();

const userSchema = require("./schemas/schema");

server.use("/graphiql", expressGraphQL({
    graphiql:true,
    schema: userSchema
}))

server.listen(4000,() => {
    console.log('Serveur is started on port 4000');
})
