import { CONTROLLER_METADATA, ControllerMetadata } from '../decorators/controller';
import { ROUTE_METADATA, RouteMetadata } from '../decorators/route';
import { USE_INTERCEPTOR_METADATA, UseInterceptorMetadata } from '../decorators/use-interceptor';
import { Interceptor } from '../types/interceptor';
import { HttpRouter } from './http-router';
import { Injectable } from '../decorators/injectable';
import { OnApplicationBoot } from '../types/hooks';
import { Injector } from '../injector';
import { Type } from '../types/type';
import { getProviderName } from '../utils/get-provider-name';

@Injectable()
export class HttpRouterManager implements OnApplicationBoot {
  constructor(
    protected readonly httpRouter: HttpRouter,
    protected readonly injector: Injector,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    const controllerInstances: any[] = await this
      .injector
      .filter(provider => Reflect.hasMetadata(CONTROLLER_METADATA, provider));

    await Promise.all(controllerInstances.map(async (controllerInstance: any) => {
      const controllerConstructor: Type = controllerInstance.constructor;
      const controllerMetadata: ControllerMetadata = Reflect.getMetadata(CONTROLLER_METADATA, controllerConstructor);

      await Promise.all(
        Object
          .getOwnPropertyNames(Object.getPrototypeOf(controllerInstance))
          .filter((name: string) => {
            return Reflect.hasMetadata(ROUTE_METADATA, controllerConstructor, name);
          })
          .map(async (routeHandlerName: string) => {
            const routeMappingMetadata: RouteMetadata = Reflect.getMetadata(ROUTE_METADATA, controllerConstructor, routeHandlerName);

            this.httpRouter.push({
              controller: controllerInstance,
              handler: Object.getOwnPropertyDescriptor(Object.getPrototypeOf(controllerInstance), routeHandlerName).value,
              interceptors: [
                ...await Promise.all(
                  ((Reflect.getMetadata(USE_INTERCEPTOR_METADATA, controllerConstructor) || []) as UseInterceptorMetadata)
                    .map(async it => ({ args: it.args, interceptor: await this.resolveInterceptor(it.interceptor) }))
                    .reverse(),
                ),
                ...await Promise.all(
                  ((Reflect.getMetadata(USE_INTERCEPTOR_METADATA, controllerConstructor, routeHandlerName) || []) as UseInterceptorMetadata)
                    .map(async it => ({ args: it.args, interceptor: await this.resolveInterceptor(it.interceptor) }))
                    .reverse(),
                ),
              ],
              meta: {
                request: {
                  body: routeMappingMetadata.schema?.request?.body,
                  cookies: routeMappingMetadata.schema?.request?.cookies,
                  headers: routeMappingMetadata.schema?.request?.headers,
                  params: routeMappingMetadata.schema?.request?.params,
                  query: routeMappingMetadata.schema?.request?.query,
                },
                responses: {
                  // responseBodySchema: routeMappingMetadata.schema?.responseBody,
                  // responseHeadersSchema: routeMappingMetadata.schema?.responseHeaders,
                },
              },
              method: routeMappingMetadata.method,
              path: `/${ controllerMetadata.path }/${ routeMappingMetadata.path }`.replace(/\/+/g, '/').replace(/\/$/g, ''),
            });
          }),
      );
    }));
  }

  protected async resolveInterceptor(interceptor: Type<Interceptor>): Promise<Interceptor> {
    const instance = await this.injector.find(interceptor);

    if (!instance) {
      throw new Error(`Cavia can't resolve interceptor '${ getProviderName(interceptor) }'`);
    }

    return instance;
  }
}
