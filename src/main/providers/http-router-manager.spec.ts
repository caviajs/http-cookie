import { Controller } from '../decorators/controller';
import { UseInterceptor } from '../decorators/use-interceptor';
import { Interceptor } from '../types/interceptor';
import { HttpRouter, HttpRoute } from './http-router';
import { HttpRouterManager } from './http-router-manager';
import { Route } from '../decorators/route';
import { Injectable } from '../decorators/injectable';
import { Logger } from './logger';
import { LoggerLevel } from './logger-level';
import { Injector } from '../injector';
import { getProviderName } from '../utils/get-provider-name';

@Injectable()
class FooInterceptor implements Interceptor {
  intercept(context, next) {
    return next.handle();
  }
}

@Injectable()
class BarInterceptor implements Interceptor {
  intercept(context, next) {
    return next.handle();
  }
}

@Controller('foo')
class FooController {
  @UseInterceptor(FooInterceptor, ['admin:foo:get'])
  @Route('GET', '/')
  public getFoo() {
  }

  @UseInterceptor(FooInterceptor, ['admin:foo:create'])
  @UseInterceptor(BarInterceptor, ['admin:foo:create'])
  @Route('POST', 'create')
  public postFoo() {
  }
}

@UseInterceptor(FooInterceptor, ['admin:bar'])
@UseInterceptor(BarInterceptor, ['admin:bar'])
@Controller('bar')
class BarController {
  @Route('GET', ':id')
  public getBar() {
  }
}

describe('HttpRouterManager', () => {
  const httpRouter: HttpRouter = new HttpRouter(new Logger(LoggerLevel.ALL, () => ''));

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onApplicationBoot', () => {
    it('should add the appropriate routs according to the metadata', async () => {
      const injector: Injector = await Injector.create([FooInterceptor, BarInterceptor, FooController, BarController]);
      const fooInterceptor: FooInterceptor = await injector.find(FooInterceptor);
      const barInterceptor: BarInterceptor = await injector.find(BarInterceptor);
      const fooController: FooController = await injector.find(FooController);
      const barController: BarController = await injector.find(BarController);

      const httpRouterManager: HttpRouterManager = new HttpRouterManager(httpRouter, injector);
      const httpRouterPushSpy: jest.SpyInstance = jest.spyOn(httpRouter, 'push').mockImplementation(jest.fn());

      expect(httpRouterPushSpy).toHaveBeenCalledTimes(0);

      await httpRouterManager.onApplicationBoot();

      expect(httpRouterPushSpy).toHaveBeenCalledTimes(3);
      expect(httpRouterPushSpy).toHaveBeenCalledWith({
        controller: fooController,
        handler: fooController.getFoo,
        interceptors: [
          { args: ['admin:foo:get'], interceptor: fooInterceptor },
        ],
        meta: {
          request: {
            body: undefined,
            cookies: undefined,
            headers: undefined,
            params: undefined,
            query: undefined,
          },
          responses: {
            // responseBodySchema: undefined,
            // responseHeadersSchema: undefined,
          },
        },
        method: 'GET',
        path: '/foo',
      } as HttpRoute);
      expect(httpRouterPushSpy).toHaveBeenCalledWith({
        controller: fooController,
        handler: fooController.postFoo,
        interceptors: [
          { args: ['admin:foo:create'], interceptor: fooInterceptor },
          { args: ['admin:foo:create'], interceptor: barInterceptor },
        ],
        meta: {
          request: {
            body: undefined,
            cookies: undefined,
            headers: undefined,
            params: undefined,
            query: undefined,
          },
          responses: {
            // responseBodySchema: undefined,
            // responseHeadersSchema: undefined,
          },
        },
        method: 'POST',
        path: '/foo/create',
      } as HttpRoute);
      expect(httpRouterPushSpy).toHaveBeenCalledWith({
        controller: barController,
        handler: barController.getBar,
        interceptors: [
          { args: ['admin:bar'], interceptor: fooInterceptor },
          { args: ['admin:bar'], interceptor: barInterceptor },
        ],
        meta: {
          request: {
            body: undefined,
            cookies: undefined,
            headers: undefined,
            params: undefined,
            query: undefined,
          },
          responses: {
            // responseBodySchema: undefined,
            // responseHeadersSchema: undefined,
          },
        },
        method: 'GET',
        path: '/bar/:id',
      } as HttpRoute);
    });

    it('should throw an exception if the interceptor cannot resolve', async () => {
      const injector: Injector = await Injector.create([BarInterceptor, FooController, BarController]);
      const httpRouterManager: HttpRouterManager = new HttpRouterManager(httpRouter, injector);

      await expect(httpRouterManager.onApplicationBoot())
        .rejects
        .toThrow(`Cavia can't resolve interceptor '${ getProviderName(FooInterceptor) }'`);
    });
  });
});
