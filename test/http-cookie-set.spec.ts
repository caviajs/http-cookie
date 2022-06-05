import http from 'http';
import supertest from 'supertest';
import { HttpCookie } from '../src';

it('serialize', async () => {
  let cookies: string[];

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCookie.set(response, 'foo', 'bar');
    HttpCookie.set(response, 'foo', 'bar baz');
    HttpCookie.set(response, 'foo', '');

    // escape
    HttpCookie.set(response, 'foo', '+ ');

    cookies = response.getHeader('Set-Cookie') as string[];

    response.end();
  });

  await supertest(httpServer)
    .get('/');

  expect(cookies).toEqual([
    'foo=bar',
    'foo=bar%20baz',
    'foo=',

    // escape
    'foo=%2B%20',
  ]);
});

it('serialize with domain', async () => {
  let cookies: string[];

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCookie.set(response, 'foo', 'bar', { domain: 'example.com' });

    cookies = response.getHeader('Set-Cookie') as string[];

    response.end();
  });

  await supertest(httpServer)
    .get('/');

  expect(cookies).toEqual([
    'foo=bar; Domain=example.com',
  ]);
});

it('serialize with expires', async () => {
  let cookies: string[];

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCookie.set(response, 'foo', 'bar', { expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)) });

    cookies = response.getHeader('Set-Cookie') as string[];

    response.end();
  });

  await supertest(httpServer)
    .get('/');

  expect(cookies).toEqual([
    'foo=bar; Expires=Sun, 24 Dec 2000 10:30:59 GMT',
  ]);
});

it('serialize with httpOnly', async () => {
  let cookies: string[];

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCookie.set(response, 'foo', 'bar', { httpOnly: true });
    HttpCookie.set(response, 'foo', 'bar', { httpOnly: false });

    cookies = response.getHeader('Set-Cookie') as string[];

    response.end();
  });

  await supertest(httpServer)
    .get('/');

  expect(cookies).toEqual([
    'foo=bar; HttpOnly',
    'foo=bar',
  ]);
});

it('serialize with maxAge', async () => {
  let cookies: string[];

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCookie.set(response, 'foo', 'bar', { maxAge: 1000 });
    HttpCookie.set(response, 'foo', 'bar', { maxAge: 0 });
    HttpCookie.set(response, 'foo', 'bar', { maxAge: 3.14 });

    cookies = response.getHeader('Set-Cookie') as string[];

    response.end();
  });

  await supertest(httpServer)
    .get('/');

  expect(cookies).toEqual([
    'foo=bar; Max-Age=1000',
    'foo=bar; Max-Age=0',
    'foo=bar; Max-Age=3',
  ]);
});

it('serialize with path', async () => {
  let cookies: string[];

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCookie.set(response, 'foo', 'bar', { path: '/' });

    cookies = response.getHeader('Set-Cookie') as string[];

    response.end();
  });

  await supertest(httpServer)
    .get('/');

  expect(cookies).toEqual([
    'foo=bar; Path=/',
  ]);
});

it('serialize with sameSite', async () => {
  let cookies: string[];

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCookie.set(response, 'foo', 'bar', { sameSite: 'Strict' });
    HttpCookie.set(response, 'foo', 'bar', { sameSite: 'Lax' });
    HttpCookie.set(response, 'foo', 'bar', { sameSite: 'None' });

    cookies = response.getHeader('Set-Cookie') as string[];

    response.end();
  });

  await supertest(httpServer)
    .get('/');

  expect(cookies).toEqual([
    'foo=bar; SameSite=Strict',
    'foo=bar; SameSite=Lax',
    'foo=bar; SameSite=None',
  ]);
});

it('serialize with secure', async () => {
  let cookies: string[];

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCookie.set(response, 'foo', 'bar', { secure: true });
    HttpCookie.set(response, 'foo', 'bar', { secure: false });

    cookies = response.getHeader('Set-Cookie') as string[];

    response.end();
  });

  await supertest(httpServer)
    .get('/');

  expect(cookies).toEqual([
    'foo=bar; Secure',
    'foo=bar',
  ]);
});

it('serialize with multiple options', async () => {
  let cookies: string[];

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCookie.set(response, 'foo', 'bar', {
      domain: 'example.com',
      expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
      httpOnly: true,
      maxAge: 1000,
      path: '/',
      sameSite: 'Strict',
      secure: true,
    });

    cookies = response.getHeader('Set-Cookie') as string[];

    response.end();
  });

  await supertest(httpServer)
    .get('/');

  expect(cookies).toEqual([
    'foo=bar; Domain=example.com; Expires=Sun, 24 Dec 2000 10:30:59 GMT; HttpOnly; Max-Age=1000; Path=/; SameSite=Strict; Secure',
  ]);
});
