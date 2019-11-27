const express =  require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

// middleware
app.use((req, res, next) => {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
}
next();
});

app.use(isAuth);

app.use('/graphql', graphqlHttp({
schema: graphQlSchema,
   rootValue: graphQlResolvers,
   graphiql: true
}));

mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true }).then(() => {
    app.listen(3100);
}).catch( err => {
   console.log(err);
});

