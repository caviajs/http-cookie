import http from 'http';
import supertest from 'supertest';
import { HttpCookie } from '../src';

it('delete', async () => {
  let cookies: string[];

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCookie.delete(response, 'foo');

    cookies = response.getHeader('Set-Cookie') as string[];

    response.end();
  });

  await supertest(httpServer)
    .get('/');

  expect(cookies).toEqual([
    `foo=; Expires=${ new Date(0).toUTCString() }; Max-Age=0`,
  ]);
});
