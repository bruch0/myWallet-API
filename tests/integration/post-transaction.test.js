import '../../src/setup.js';
import supertest from 'supertest';
import faker from 'faker';
import { v4 as uuid } from 'uuid';

import app from '../../src/app.js';
import clearDatabase from '../utils/clearDatabase.js';
import createSession from '../factories/createSession.js';

beforeAll(clearDatabase);

describe('POST transactions', () => {
  it('should return code 401 when not receiving token', async () => {
    const result = await supertest(app).post('/transactions');
    const status = result.status;

    expect(status).toEqual(401);
  });

  it('should return code 401 when receiving invalid token', async () => {
    const result = await supertest(app)
      .post('/transactions')
      .set('authorization', 'invalidToken');
    const status = result.status;

    expect(status).toEqual(401);
  });

  it('should return code 401 when token is not found', async () => {
    const token = uuid();
    const result = await supertest(app)
      .post('/transactions')
      .set('authorization', `Bearer ${token}`);
    const status = result.status;

    expect(status).toEqual(401);
  });

  it('should return code 401 when token is received not in the bearer pattern', async () => {
    const { token } = await createSession();
    const result = await supertest(app)
      .post('/transactions')
      .set('authorization', `${token}`);
    const status = result.status;

    expect(status).toEqual(401);
  });

  it('should return code 400 when token is valid but received no body', async () => {
    const { token } = await createSession();
    const result = await supertest(app)
      .post('/transactions')
      .set('authorization', `Bearer ${token}`);
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 401 when received valid body but no token', async () => {
    const body = {
      value: JSON.stringify(faker.datatype.number()),
      description: faker.datatype.string(),
      type: faker.random.arrayElement(['input', 'output']),
    };
    const result = await supertest(app).post('/transactions').send(body);
    const status = result.status;

    expect(status).toEqual(401);
  });

  it('should return code 401 when received valid body but token is invalid', async () => {
    const token = uuid();
    const body = {
      value: JSON.stringify(faker.datatype.number()),
      description: faker.datatype.string(),
      type: faker.random.arrayElement(['input', 'output']),
    };
    const result = await supertest(app)
      .post('/transactions')
      .set('authorization', `Bearer ${token}`)
      .send(body);
    const status = result.status;

    expect(status).toEqual(401);
  });

  it('should return code 400 when token is valid but received empty body', async () => {
    const { token } = await createSession();
    const result = await supertest(app)
      .post('/transactions')
      .set('authorization', `Bearer ${token}`)
      .send({});
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 400 when received valid token but no value on body', async () => {
    const { token } = await createSession();
    const body = {
      description: faker.datatype.string(),
      type: faker.random.arrayElement(['input', 'output']),
    };
    const result = await supertest(app)
      .post('/transactions')
      .set('authorization', `Bearer ${token}`)
      .send(body);
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 400 when received valid token but empty value on body', async () => {
    const { token } = await createSession();
    const body = {
      value: '',
      description: faker.datatype.string(),
      type: faker.datatype.string(),
    };
    const result = await supertest(app)
      .post('/transactions')
      .set('authorization', `Bearer ${token}`)
      .send(body);
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 400 when received valid token but no description on body', async () => {
    const { token } = await createSession();
    const body = {
      value: JSON.stringify(faker.datatype.number()),
      type: faker.random.arrayElement(['input', 'output']),
    };
    const result = await supertest(app)
      .post('/transactions')
      .set('authorization', `Bearer ${token}`)
      .send(body);
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 400 when received valid token but short description on body', async () => {
    const { token } = await createSession();
    const body = {
      value: JSON.stringify(faker.datatype.number()),
      description: faker.datatype.string(4),
      type: faker.datatype.string(),
    };
    const result = await supertest(app)
      .post('/transactions')
      .set('authorization', `Bearer ${token}`)
      .send(body);
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 400 when received valid token but no type on body', async () => {
    const { token } = await createSession();
    const body = {
      value: JSON.stringify(faker.datatype.number()),
      description: faker.datatype.string(),
    };
    const result = await supertest(app)
      .post('/transactions')
      .set('authorization', `Bearer ${token}`)
      .send(body);
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 400 when received valid token but invalid type on body', async () => {
    const { token } = await createSession();
    const body = {
      value: JSON.stringify(faker.datatype.number()),
      description: faker.datatype.string(),
      type: faker.datatype.string(),
    };
    const result = await supertest(app)
      .post('/transactions')
      .set('authorization', `Bearer ${token}`)
      .send(body);
    const status = result.status;

    expect(status).toEqual(400);
  });

  it('should return code 201 when received valid token and body', async () => {
    const { token } = await createSession();
    const body = {
      value: JSON.stringify(faker.datatype.number()),
      description: faker.datatype.string(),
      type: faker.random.arrayElement(['input', 'output']),
    };
    const result = await supertest(app)
      .post('/transactions')
      .set('authorization', `Bearer ${token}`)
      .send(body);
    const status = result.status;

    expect(status).toEqual(201);
  });
});
