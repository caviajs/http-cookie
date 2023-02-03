import * as http from 'http';

export class HttpCookie {
  public static delete(response: http.ServerResponse, name: string, options?: CookieDeleteOptions): void {
    HttpCookie.set(response, name, '', { ...options || {}, maxAge: 0, expires: new Date(0) });
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

  public static parse(request: http.IncomingMessage): Cookies {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie
    return Object
      .values((request.headers.cookie || '').split('; '))
      // skip things that don't look like key=value
      .filter((cookie: string) => cookie.includes('='))
      .reduce<Cookies>((prev: Cookies, cookie: string) => {
        const [key, value] = cookie.split('=');

        return { ...prev, [key.trim()]: tryDecode(value.trim()) };
      }, {});
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

export interface Cookies {
  [name: string]: string;
}

export interface CookieDeleteOptions {
  domain?: string;
  httpOnly?: boolean;
  path?: string;
  sameSite?: 'Lax' | 'Strict' | 'None';
  secure?: boolean;
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
