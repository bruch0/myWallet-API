import '../../src/setup.js';
import supertest from 'supertest';
import { v4 as uuid } from 'uuid';

import app from '../../src/app.js';
import clearDatabase from '../utils/clearDatabase.js';
import createSession from '../factories/createSession.js';

beforeAll(clearDatabase);

describe('GET transactions', () => {
  it('should return code 401 when not receiving token', async () => {
    const result = await supertest(app).get('/transactions');
    const status = result.status;

    expect(status).toEqual(401);
  });

  it('should return code 401 when receiving invalid token', async () => {
    const result = await supertest(app)
      .get('/transactions')
      .set('authorization', 'invalidToken');
    const status = result.status;

    expect(status).toEqual(401);
  });

  it('should return code 401 when token is not found', async () => {
    const token = uuid();
    const result = await supertest(app)
      .get('/transactions')
      .set('authorization', `Bearer ${token}`);
    const status = result.status;

    expect(status).toEqual(401);
  });

  it('should return code 401 when token is received not in the bearer pattern', async () => {
    const { token } = await createSession();
    const result = await supertest(app)
      .get('/transactions')
      .set('authorization', `${token}`);
    const status = result.status;

    expect(status).toEqual(401);
  });

  it('should return code 200 when token is valid', async () => {
    const { token } = await createSession();
    const result = await supertest(app)
      .get('/transactions')
      .set('authorization', `Bearer ${token}`);
    const status = result.status;

    expect(status).toEqual(200);
  });
});
