const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const skills = require('./routes/skills');
const users = require('./routes/users');
const auth = require('./routes/auth');
const freelancers = require('./routes/freelancers');
const express = require('express');
const app = express();


const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Freelance API',
            version: '3.0.0',
            description: 'Interview take home test',
            contact:{
                name:'Jamal N. Ahmad',
                email:'jamal.nasir@me.com'
            },
        },
        servers: ['http://192.168.1.23:3000/api'],
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'x-auth-token',
                scheme: 'bearer',
                in: 'header',
            }},
        security: [ { bearerAuth: [] } ]
    },
    apis: ['./routes/*.js'],
};

const swaggerDocumentation = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));

console.log(swaggerDocumentation);

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/fl_db')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/skills', skills);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/freelancers', freelancers);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
