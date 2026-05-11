const request = require('supertest');
const app = require('../app');

describe('MiniAssignment API', () => {
  it('returns public endpoint response', async () => {
    const response = await request(app).get('/public');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'This endpoint is public and does not require authentication.' });
  });

  it('returns a JWT token after successful login and allows access to protected tasks route', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({ username: 'admin', password: 'password' });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeDefined();

    const token = loginResponse.body.token;
    const tasksResponse = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(tasksResponse.status).toBe(200);
    expect(tasksResponse.body.user).toEqual({ username: 'admin', iat: expect.any(Number), exp: expect.any(Number) });
    expect(Array.isArray(tasksResponse.body.tasks)).toBe(true);
  });
});
