import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpCookie } from '../src';

it('setup', async () => {
  let cookies: http.Cookies;

  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpCookie.setup())
    .route({ handler: (request) => cookies = request.cookies, method: 'GET', path: '/' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  await supertest(httpServer)
    .get('/')
    .set('Cookie', ['foo=1245', 'bar=4512']);

  expect(cookies).toEqual({ foo: '1245', bar: '4512' });
});
