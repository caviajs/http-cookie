<div align="center">
<h3>@caviajs/http-cookie</h3>
<p>a micro framework for node.js</p>
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

// ...
router.intercept((request, response, next) => {
  request.cookies = HttpCookie.parse(request);

  return next.handle();
});
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
