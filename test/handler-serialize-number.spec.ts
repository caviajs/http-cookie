import http from 'http';
import { of } from 'rxjs';
import supertest from 'supertest';
import { HttpRouter } from '../src';

const EXAMPLE_NUMBER: number = 1245;

it('should correctly serialize number', async () => {
  // sync
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter.route({ handler: () => EXAMPLE_NUMBER, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const raw: string = JSON.stringify(EXAMPLE_NUMBER);

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_NUMBER);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  // async
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter.route({ handler: () => Promise.resolve(EXAMPLE_NUMBER), method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const raw: string = JSON.stringify(EXAMPLE_NUMBER);

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_NUMBER);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  // sync + observable
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter.route({ handler: () => of(EXAMPLE_NUMBER), method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const raw: string = JSON.stringify(EXAMPLE_NUMBER);

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_NUMBER);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  // async + observable
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter.route({ handler: () => Promise.resolve(of(EXAMPLE_NUMBER)), method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const raw: string = JSON.stringify(EXAMPLE_NUMBER);

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_NUMBER);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }
});