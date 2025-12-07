import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Netflixo API',
            version: '1.0.0',
            description: 'API Documentation for Netflixo Application',
            contact: {
                name: 'Developer',
                email: 'dev@example.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:5001/api',
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js', './controllers/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export default specs;
