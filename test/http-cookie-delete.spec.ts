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

it('delete with domain', async () => {
  let cookies: string[];

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCookie.delete(response, 'foo', { domain: 'example.com' });

    cookies = response.getHeader('Set-Cookie') as string[];

    response.end();
  });

  await supertest(httpServer)
    .get('/');

  expect(cookies).toEqual([
    `foo=; Domain=example.com; Expires=${ new Date(0).toUTCString() }; Max-Age=0`,
  ]);
});

it('delete with httpOnly', async () => {
  let cookies: string[];

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCookie.delete(response, 'foo', { httpOnly: true });
    HttpCookie.delete(response, 'foo', { httpOnly: false });

    cookies = response.getHeader('Set-Cookie') as string[];

    response.end();
  });

  await supertest(httpServer)
    .get('/');

  expect(cookies).toEqual([
    `foo=; Expires=${ new Date(0).toUTCString() }; HttpOnly; Max-Age=0`,
    `foo=; Expires=${ new Date(0).toUTCString() }; Max-Age=0`,
  ]);
});

it('delete with path', async () => {
  let cookies: string[];

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCookie.delete(response, 'foo', { path: '/' });

    cookies = response.getHeader('Set-Cookie') as string[];

    response.end();
  });

  await supertest(httpServer)
    .get('/');

  expect(cookies).toEqual([
    `foo=; Expires=${ new Date(0).toUTCString() }; Max-Age=0; Path=/`,
  ]);
});

it('delete with sameSite', async () => {
  let cookies: string[];

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCookie.delete(response, 'foo', { sameSite: 'Strict' });
    HttpCookie.delete(response, 'foo', { sameSite: 'Lax' });
    HttpCookie.delete(response, 'foo', { sameSite: 'None' });

    cookies = response.getHeader('Set-Cookie') as string[];

    response.end();
  });

  await supertest(httpServer)
    .get('/');

  expect(cookies).toEqual([
    `foo=; Expires=${ new Date(0).toUTCString() }; Max-Age=0; SameSite=Strict`,
    `foo=; Expires=${ new Date(0).toUTCString() }; Max-Age=0; SameSite=Lax`,
    `foo=; Expires=${ new Date(0).toUTCString() }; Max-Age=0; SameSite=None`,
  ]);
});

it('delete with secure', async () => {
  let cookies: string[];

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCookie.delete(response, 'foo', { secure: true });
    HttpCookie.delete(response, 'foo', { secure: false });

    cookies = response.getHeader('Set-Cookie') as string[];

    response.end();
  });

  await supertest(httpServer)
    .get('/');

  expect(cookies).toEqual([
    `foo=; Expires=${ new Date(0).toUTCString() }; Max-Age=0; Secure`,
    `foo=; Expires=${ new Date(0).toUTCString() }; Max-Age=0`,
  ]);
});

it('delete with multiple options', async () => {
  let cookies: string[];

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCookie.delete(response, 'foo', {
      domain: 'example.com',
      httpOnly: true,
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
    `foo=; Domain=example.com; Expires=${ new Date(0).toUTCString() }; HttpOnly; Max-Age=0; Path=/; SameSite=Strict; Secure`,
  ]);
});
