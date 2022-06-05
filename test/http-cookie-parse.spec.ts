import http from 'http';
import supertest from 'supertest';
import { Cookies, HttpCookie } from '../src';

it('parse', async () => {
  let cookies: Cookies;

  const httpServer: http.Server = http.createServer((request, response) => {
    cookies = HttpCookie.parse(request);

    response.end();
  });

  await supertest(httpServer)
    .get('/')
    .set('Cookie', ['foo=1245', 'bar=4512']);

  expect(cookies).toEqual({ foo: '1245', bar: '4512' });
});
