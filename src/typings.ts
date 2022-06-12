declare module 'http' {
  export interface Cookies {
    readonly [name: string]: string;
  }

  export interface IncomingMessage {
    cookies: Cookies | undefined;
  }
}
