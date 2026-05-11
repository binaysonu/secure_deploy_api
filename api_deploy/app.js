require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const authenticateToken = require('./authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'MiniAssignment API',
    version: '1.0.0',
    description: 'Swagger documentation for the MiniAssignment REST API.'
  },
  servers: [{ url: `http://localhost:${PORT}` }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    '/public': {
      get: {
        summary: 'Public endpoint',
        responses: {
          '200': {
            description: 'Public message',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/login': {
      post: {
        summary: 'Login and receive JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'JWT token response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' }
                  }
                }
              }
            }
          },
          '400': { description: 'Bad request' },
          '401': { description: 'Invalid credentials' }
        }
      }
    },
    '/tasks': {
      get: {
        summary: 'Protected tasks endpoint',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Returning tasks list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { type: 'object' },
                    tasks: {
                      type: 'array',
                      items: { type: 'object' }
                    }
                  }
                }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Invalid or expired token' }
        }
      }
    },
    '/status': {
      get: {
        summary: 'Health status endpoint',
        responses: {
          '200': {
            description: 'API status response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    uptime: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const tasks = [
  { id: 1, title: 'Learn JWT', completed: false },
  { id: 2, title: 'Build Docker image', completed: false }
];

app.use(express.json());

app.get('/public', (req, res) => {
  res.json({ message: 'This endpoint is public and does not require authentication.' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (username !== 'admin' || password !== 'password') {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/tasks', authenticateToken, (req, res) => {
  res.json({ user: req.user, tasks });
});

app.get('/status', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
