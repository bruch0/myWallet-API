import '../../src/setup.js';
import supertest from 'supertest';
import faker from 'faker';

import app from '../../src/app.js';
import clearDatabase from '../utils/clearDatabase.js';

beforeAll(clearDatabase);

describe('POST sign-up', () => {
  it('should return code 400 when not receiving body', async () => {
    const result = await supertest(app).post('/sign-up');
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 400 when receiving empty body', async () => {
    const result = await supertest(app).post('/sign-up').send({});
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 400 when the body is missing password', async () => {
    const body = {
      name: faker.name.findName(),
      email: faker.internet.email(),
    };

    const result = await supertest(app).post('/sign-up').send(body);
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 400 when the body is missing email', async () => {
    const body = {
      name: faker.name.findName(),
      password: faker.internet.password(),
    };

    const result = await supertest(app).post('/sign-up').send(body);
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 400 when the body is missing name', async () => {
    const body = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const result = await supertest(app).post('/sign-up').send(body);
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 201 when the user is created', async () => {
    const body = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const result = await supertest(app).post('/sign-up').send(body);
    const status = result.status;

    expect(status).toEqual(201);
  });

  it('should return code 409 when the email is registered', async () => {
    const body = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await supertest(app).post('/sign-up').send(body);
    const result = await supertest(app).post('/sign-up').send(body);
    const status = result.status;

    expect(status).toEqual(409);
  });
});
