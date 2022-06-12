import { Interceptor, Next } from '@caviajs/http-router';
import * as http from 'http';
import { Observable } from 'rxjs';

export class HttpCookie {
  public static delete(response: http.ServerResponse, name: string): void {
    HttpCookie.set(response, name, '', { maxAge: 0, expires: new Date(0) });
  }

  public static set(response: http.ServerResponse, name: string, value: any, options?: CookieSerializationOptions): void {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
    let setCookieHeader = response.getHeader('Set-Cookie') || [];

    if (typeof setCookieHeader === 'number') {
      setCookieHeader = [setCookieHeader.toString()];
    }

    if (typeof setCookieHeader === 'string') {
      setCookieHeader = [setCookieHeader];
    }

    setCookieHeader.push(serializeCookie(name, value, options));

    response.setHeader('Set-Cookie', setCookieHeader);
  }

  public static setup(): Interceptor {
    return async (request: http.IncomingMessage, response: http.ServerResponse, next: Next): Promise<Observable<any>> => {
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie
      request.cookies = Object
        .values((request.headers.cookie || '').split('; '))
        // skip things that don't look like key=value
        .filter((cookie: string) => cookie.includes('='))
        .reduce((prev: http.Cookies, cookie: string) => {
          const [key, value] = cookie.split('=');

          return { ...prev, [key.trim()]: tryDecode(value.trim()) };
        }, {});

      return next.handle();
    };
  }
}

function serializeCookie(name: string, value: string, options?: CookieSerializationOptions): string {
  let cookie = `${ name }=${ encodeURIComponent(value) }`;

  if (options?.domain) {
    cookie += '; Domain=' + options.domain;
  }

  if (options?.expires) {
    cookie += '; Expires=' + options.expires.toUTCString();
  }

  if (options?.httpOnly) {
    cookie += '; HttpOnly';
  }

  if (options?.maxAge !== undefined) {
    cookie += '; Max-Age=' + Math.floor(options.maxAge);
  }

  if (options?.path) {
    cookie += '; Path=' + options.path;
  }

  if (options?.sameSite) {
    switch (options.sameSite) {
      case 'Lax':
        cookie += '; SameSite=Lax';
        break;
      case 'Strict':
        cookie += '; SameSite=Strict';
        break;
      case 'None':
        cookie += '; SameSite=None';
        break;
    }
  }

  if (options?.secure) {
    cookie += '; Secure';
  }

  return cookie;
}

function tryDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}

export interface CookieSerializationOptions {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: 'Lax' | 'Strict' | 'None';
  secure?: boolean;
}
