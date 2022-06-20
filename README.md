<div align="center">
<h3>@caviajs/http-cookie</h3>
<p>ecosystem for your guinea pig</p>
</div>

<div align="center">
<h4>Installation</h4>
</div>

```shell
npm install @caviajs/http-cookie --save
```

<div align="center">
<h4>Usage</h4>
</div>

Request cookies:

```typescript
import { HttpCookie } from '@caviajs/http-cookie';
import { Interceptor } from '@caviajs/http-router';

export const HttpCookieInterceptor: Interceptor = HttpCookie.setup({ /* ... */ });
// ...
```

```typescript
// ...
httpRouter
  .intercept(HttpCookieInterceptor)
// ...
```

Response cookies:

```typescript
import { HttpCookie } from '@caviajs/http-cookie';

// ...
router.route({
  handler: (request, response, next) => {
    HttpCookie.set(response, 'foo', 'bar', { /* ... */ });
    // or
    HttpCookie.delete(response, 'foo');
  },
  // ...
});
// ...
```

<div align="center">
  <sub>Built with ❤︎ by <a href="https://partyka.dev">Paweł Partyka</a></sub>
</div>
