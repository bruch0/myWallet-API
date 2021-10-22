import app from '../app.js';
import connection from '../database.js';
import supertest from 'supertest';

beforeAll(async () => {
  await connection.query(`
    DELETE FROM 
        users WHERE 
            email = 'userNotRegistered@test.com';`);
});

afterAll(async () => {
  await connection.query(`DELETE FROM users WHERE email = 'user@test.com';`);
  connection.end();
});

describe('POST sign-up', () => {
  it('should return code 400 when the body is not correct', async () => {
    const body = {
      email: 'random@user.com',
    };
    const result = await supertest(app).post('/sign-up').send(body);
    const status = result.status;
    expect(status).toEqual(400);
  });

  it('should return code 400 when the body fails market rules', async () => {
    const body = {
      name: '',
      email: 'random@user.com',
      password: '1',
    };
    const result = await supertest(app).post('/sign-up').send(body);
    const status = result.status;
    expect(status).toEqual(400);
  });

  it('should return code 201 when the user is created', async () => {
    const body = {
      name: 'username',
      email: 'user@test.com',
      password: 'usertest',
    };
    const result = await supertest(app).post('/sign-up').send(body);
    const status = result.status;
    expect(status).toEqual(201);
  });

  it('should return code 409 when the email is registered', async () => {
    const body = {
      name: 'username',
      email: 'user@test.com',
      password: 'usertest',
    };
    const result = await supertest(app).post('/sign-up').send(body);
    const status = result.status;
    expect(status).toEqual(409);
  });
});

describe('POST sign-in', () => {
  it('should return code 400 when the body is not correct', async () => {
    const body = {
      email: 'user@test.com',
    };
    const result = await supertest(app).post('/sign-in').send(body);
    const status = result.status;
    expect(status).toEqual(400);
  });

  it('should return code 400 when the body fails market rules', async () => {
    const body = {
      email: 'user@test.com',
      password: '1',
    };
    const result = await supertest(app).post('/sign-in').send(body);
    const status = result.status;
    expect(status).toEqual(400);
  });

  it('should return code 404 when the email is not registered', async () => {
    const body = {
      email: 'userNotRegistered@test.com',
      password: '123456',
    };
    const result = await supertest(app).post('/sign-in').send(body);
    const status = result.status;
    expect(status).toEqual(404);
  });

  it('should return code 401 when the password is incorrect', async () => {
    const body = {
      email: 'user@test.com',
      password: '123456',
    };
    const result = await supertest(app).post('/sign-in').send(body);
    const status = result.status;
    expect(status).toEqual(401);
  });

  it('should return code 200 when the user is able to login', async () => {
    const body = {
      email: 'user@test.com',
      password: 'usertest',
    };
    const result = await supertest(app).post('/sign-in').send(body);
    const status = result.status;
    expect(status).toEqual(200);
  });
});
