<div align="center">
<h3>@caviajs/http-cookie</h3>
<p>ecosystem for your guinea pig</p>
</div>

## Introduction

An HTTP cookie is a small piece of data stored by the user's browser. Cookies were designed to be a reliable mechanism
for websites to remember stateful information. When the user visits the website again, the cookie is automatically sent
with the request.

## Usage

### Installation

```shell
npm install @caviajs/http-cookie --save
```

### Request cookies

#### Configure the interceptor

```typescript
import { HttpCookie } from '@caviajs/http-cookie';
import { Interceptor } from '@caviajs/http-router';

export const HttpCookieInterceptor: Interceptor = HttpCookie.setup();
```

#### Bind the interceptor

```typescript
httpRouter
  .intercept(HttpCookieInterceptor);
```

#### Use cookies

```typescript
import { HttpCookie } from '@caviajs/http-cookie';

router
  .route({
    handler: (request, response, next) => {
      // request.cookies.foo
    },
    /* ... */
  });
```

### Response cookies

#### Set cookie

```typescript
import { HttpCookie } from '@caviajs/http-cookie';

router
  .route({
    handler: (request, response, next) => {
      HttpCookie.set(response, 'name', 'value', {
        /* 
          domain?: string;
          expires?: Date;
          httpOnly?: boolean;
          maxAge?: number;
          path?: string;
          sameSite?: 'Lax' | 'Strict' | 'None';
          secure?: boolean; 
        */
      });
    },
    /* ... */
  });
```

#### Delete cookie

```typescript
import { HttpCookie } from '@caviajs/http-cookie';

router
  .route({
    handler: (request, response, next) => {
      HttpCookie.delete(response, 'name', {
        /* 
          domain?: string;
          httpOnly?: boolean;
          path?: string;
          sameSite?: 'Lax' | 'Strict' | 'None';
          secure?: boolean; 
        */
      });
    },
    /* ... */
  });
```

<div align="center">
  <sub>Built with ❤︎ by <a href="https://partyka.dev">Paweł Partyka</a></sub>
</div>
