const app = require('../app');
const request = require('supertest');
const chance = require('chance').Chance();
const { mongoose, dbUrl } = require('../models/connection');

describe('creates user', () => {
  beforeEach(() => {
    mongoose.connect(dbUrl);
  });

  afterEach(() => {
    mongoose.disconnect();
  });
  it('returns status code 201 if valid new user is passed', async () => {
    const res = await request(app).post('/register').send({
      firstName: 'test',
      lastName: 'ing',
      handle: chance.string(),
      email: chance.email(),
      password: 'test123',
      bio: 'a test',
    });
    expect(res.statusCode).toEqual(201);
  });
  it('should specify json in the content type header', async () => {
    const res = await request(app).post('/register').send({
      firstName: 'test',
      lastName: 'ing',
      handle: chance.string(),
      email: chance.email(),
      password: 'test123',
      bio: 'another test',
    });
    // expect(res.statusCode).toEqual(201);
    expect(res.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
  });
  it('response has a token', async () => {
    const res = await request(app).post('/register').send({
      firstName: 'test',
      lastName: 'ing',
      handle: chance.string(),
      email: chance.email(),
      password: 'test123',
      bio: 'another test',
    });
    expect(res.body.token).toBeDefined();
  });
});

// describe('logs in user by id',()=>{

//   it('returns status code 201 if valid user is fetched', async () => {
//     const res = await (await request(app).get('/login').set('email','VALIDEMAIL')).set('password','VALIDPASSWORD')
   
//   });

// });

