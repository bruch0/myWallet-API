import '../../src/setup.js';
import supertest from 'supertest';
import faker from 'faker';

import app from '../../src/app.js';
import clearDatabase from '../utils/clearDatabase.js';
import createUser from '../factories/createUser.js';

beforeAll(clearDatabase);

describe('POST sign-in', () => {
  it('should return code 400 when not receiving body', async () => {
    const result = await supertest(app).post('/sign-in');
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 400 when receiving empty body', async () => {
    const result = await supertest(app).post('/sign-in');
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 400 when not receiving email', async () => {
    const { password } = await createUser();
    const result = await supertest(app).post('/sign-in').send({ password });
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 400 when not receiving password', async () => {
    const { email } = await createUser();
    const result = await supertest(app).post('/sign-in').send({ email });
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 404 when not founding email', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const result = await supertest(app)
      .post('/sign-in')
      .send({ email, password });
    const status = result.status;

    expect(status).toEqual(404);
  });

  it('should return code 401 when receiving wrong password', async () => {
    const { email } = await createUser();
    const wrongPassword = faker.internet.password();
    const result = await supertest(app)
      .post('/sign-in')
      .send({ email, password: wrongPassword });
    const status = result.status;

    expect(status).toEqual(401);
  });

  it('should return code 200 when receiving valid data', async () => {
    const { email, password } = await createUser();
    const result = await supertest(app)
      .post('/sign-in')
      .send({ email, password });
    const status = result.status;

    expect(status).toEqual(200);
  });
});
