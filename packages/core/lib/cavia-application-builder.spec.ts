import { Application } from './decorators/application';
import { CaviaApplicationBuilder } from './cavia-application-builder';
import { getProviderToken } from './utils/get-provider-token';
import { Injectable } from './decorators/injectable';
import { Inject } from './decorators/inject';
import { Provider } from './types/provider';
import { Token } from './types/token';

class CaviaBuilderTest extends CaviaApplicationBuilder {
  public readonly providers: Map<Token, Provider> = new Map();
}

describe('CaviaBuilder', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should collect providers from metadata...', async () => {
    @Application({
      packages: [
        { providers: [{ provide: 'foo-1', useValue: 10 }] },
        { providers: [{ provide: 'foo-2', useValue: 20 }] },
      ],
      providers: [
        { provide: 'bar-1', useValue: 30 },
        { provide: 'bar-2', useValue: 40 },
      ],
    })
    class MyApp {
    }

    const caviaBuilder = new CaviaBuilderTest(MyApp);

    expect(caviaBuilder.providers.values()).toEqual([
      { provide: 'foo-1', useValue: 10 },
      { provide: 'foo-2', useValue: 20 },
      { provide: 'bar-1', useValue: 30 },
      { provide: 'bar-2', useValue: 40 },
    ]);
  });

  it('should overwrite package tokens if present in application providers', async () => {
    @Application({
      packages: [
        { providers: [{ provide: 'foo', useValue: 1 }] },
      ],
      providers: [
        { provide: 'foo', useValue: 2 },
      ],
    })
    class MyApp {
    }

    const caviaBuilder = new CaviaBuilderTest(MyApp);

    expect(caviaBuilder.providers.values()).toEqual([
      { provide: 'foo', useValue: 2 },
    ]);
  });

  it('should throw an exception if the class is not marked with the @Application decorator', () => {
    class MyApp {
    }

    try {
      new CaviaApplicationBuilder(MyApp);
    } catch (e) {
      expect(e.message).toBe(`The '${ MyApp.name }' should be annotated as an application`);
    }
  });

  describe('overrideProvider', () => {
    @Injectable()
    class Car {
      constructor(@Inject('engine') public engine: string) {
      }
    }

    const providers: Provider[] = [
      Car,
      { provide: 'engine', useValue: 'engine' },
    ];

    describe('useClass', () => {
      it('should properly override providers', async () => {
        @Injectable()
        class TestingCar {
          constructor(@Inject('engine') public engine: string) {
          }
        }

        @Injectable()
        class TestingEngine {
        }

        {
          @Application({
            providers: providers,
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useClass(TestingCar)
            .overrideProvider('engine').useClass(TestingEngine)
            .compile();

          expect(await application.injector.find(provider => getProviderToken(provider) === Car)).toBeInstanceOf(TestingCar);
          expect(await application.injector.find(provider => getProviderToken(provider) === 'engine')).toBeInstanceOf(TestingEngine);
        }

        {
          @Application({
            packages: [
              { providers: providers },
            ],
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useClass(TestingCar)
            .overrideProvider('engine').useClass(TestingEngine)
            .compile();

          expect(await application.injector.find(provider => getProviderToken(provider) === Car)).toBeInstanceOf(TestingCar);
          expect(await application.injector.find(provider => getProviderToken(provider) === 'engine')).toBeInstanceOf(TestingEngine);
        }

        {
          @Application({
            packages: [
              { providers: providers },
            ],
            providers: providers,
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useClass(TestingCar)
            .overrideProvider('engine').useClass(TestingEngine)
            .compile();

          expect(await application.injector.find(provider => getProviderToken(provider) === Car)).toBeInstanceOf(TestingCar);
          expect(await application.injector.find(provider => getProviderToken(provider) === 'engine')).toBeInstanceOf(TestingEngine);
        }
      });
    });

    describe('useFactory', () => {
      it('should properly override providers', async () => {
        {
          @Application({
            providers: providers,
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useFactory({ dependencies: ['engine'], factory: engine => ({ engine }) })
            .overrideProvider('engine').useFactory({ factory: () => 'v8' })
            .compile();

          expect(await application.injector.find(provider => getProviderToken(provider) === Car)).toEqual({ engine: 'v8' });
          expect(await application.injector.find(provider => getProviderToken(provider) === 'engine')).toEqual('v8');
        }

        {
          @Application({
            packages: [
              { providers: providers },
            ],
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useFactory({ dependencies: ['engine'], factory: engine => ({ engine }) })
            .overrideProvider('engine').useFactory({ factory: () => 'v8' })
            .compile();

          expect(await application.injector.find(provider => getProviderToken(provider) === Car)).toEqual({ engine: 'v8' });
          expect(await application.injector.find(provider => getProviderToken(provider) === 'engine')).toEqual('v8');
        }

        {
          @Application({
            packages: [
              { providers: providers },
            ],
            providers: providers,
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useFactory({ dependencies: ['engine'], factory: engine => ({ engine }) })
            .overrideProvider('engine').useFactory({ factory: () => 'v8' })
            .compile();

          expect(await application.injector.find(provider => getProviderToken(provider) === Car)).toEqual({ engine: 'v8' });
          expect(await application.injector.find(provider => getProviderToken(provider) === 'engine')).toEqual('v8');
        }
      });
    });

    describe('useValue', () => {
      it('should properly override providers', async () => {
        {
          @Application({
            providers: providers,
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useValue('BMW')
            .overrideProvider('engine').useValue('v8')
            .compile();

          expect(await application.injector.find(provider => getProviderToken(provider) === Car)).toEqual('BMW');
          expect(await application.injector.find(provider => getProviderToken(provider) === 'engine')).toEqual('v8');
        }

        {
          @Application({
            packages: [
              { providers: providers },
            ],
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useValue('BMW')
            .overrideProvider('engine').useValue('v8')
            .compile();

          expect(await application.injector.find(provider => getProviderToken(provider) === Car)).toEqual('BMW');
          expect(await application.injector.find(provider => getProviderToken(provider) === 'engine')).toEqual('v8');
        }

        {
          @Application({
            packages: [
              { providers: providers },
            ],
            providers: providers,
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useValue('BMW')
            .overrideProvider('engine').useValue('v8')
            .compile();

          expect(await application.injector.find(provider => getProviderToken(provider) === Car)).toEqual('BMW');
          expect(await application.injector.find(provider => getProviderToken(provider) === 'engine')).toEqual('v8');
        }
      });
    });
  });
});