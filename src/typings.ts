declare module 'http' {
  export interface Cookies {
    [name: string]: string;
  }

  export interface IncomingMessage {
    cookies: Cookies | undefined;
  }
}
