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

  // eslint-disable-next-line max-len
  it('should return a unique token on first login and return the same token on second login', async () => {
    const body = {
      email: 'user@test.com',
      password: 'usertest',
    };
    const result = await supertest(app).post('/sign-in').send(body);
    const token = result.body.token;
    const newResult = await supertest(app).post('/sign-in').send(body);
    const newToken = newResult.body.token;
    expect(newToken).toEqual(token);
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

describe('GET transactions', () => {
  beforeAll(async () => {
    await connection.query(`
    INSERT INTO
        sessions (token, userid)
        VALUES ('token', 0)`);
  });

  it('should return code 401 when token is not given in headers', async () => {
    const result = await supertest(app).get('/transactions');
    const status = result.status;
    expect(status).toEqual(401);
  });

  it('should return code 401 when token is not valid', async () => {
    const result = await supertest(app).get('/transactions')
        .set('Authorization', 'wrongToken');
    const status = result.status;
    expect(status).toEqual(409);
  });

  it('should return code 200 when token is valid', async () => {
    const result = await supertest(app).get('/transactions')
        .set('Authorization', 'Bearer token');
    const status = result.status;
    expect(status).toEqual(200);
  });
});

describe('POST transactions', () => {
  afterAll(async () => {
    await connection.query(`
        DELETE FROM 
            sessions WHERE 
            userid = 0;`);
  });

  it('should return code 401 when theres is no token', async () => {
    const body = {
      value: '100',
      description: 'test value',
      type: 'input',
    };
    const result = await supertest(app).post('/transactions').send(body);
    const status = result.status;
    expect(status).toEqual(401);
  });

  it('should return code 401 when the token is invalid', async () => {
    const body = {
      value: '100',
      description: 'test value',
      type: 'input',
    };
    const result = await supertest(app).post('/transactions')
        .set('Authorization', 'Bearer invalidToken')
        .send(body);
    const status = result.status;
    expect(status).toEqual(401);
  });

  it('should return code 400 when the body is not correct', async () => {
    const body = {
      value: '',
    };
    const result = await supertest(app).post('/transactions')
        .set('Authorization', 'Bearer token')
        .send(body);
    const status = result.status;
    expect(status).toEqual(400);
  });

  it('should return code 400 when the body fails market rules', async () => {
    const body = {
      value: '',
      description: 'random@user.com',
      type: '',
    };
    const result = await supertest(app).post('/transactions')
        .set('Authorization', 'Bearer token')
        .send(body);
    const status = result.status;
    expect(status).toEqual(400);
  });


  it('should return code 201 when the transaction is created', async () => {
    const body = {
      value: '100',
      description: 'teste value',
      type: 'input',
    };
    const result = await supertest(app).post('/transactions')
        .set('Authorization', 'Bearer token')
        .send(body);
    const status = result.status;
    expect(status).toEqual(201);
  });
});

