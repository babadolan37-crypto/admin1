declare module 'npm:hono' {
  export class Hono {
    constructor();
    use(path: string, ...middlewares: any[]): any;
    get(path: string, handler: (c: any) => any): any;
    post(path: string, handler: (c: any) => any): any;
    put(path: string, handler: (c: any) => any): any;
    delete(path: string, handler: (c: any) => any): any;
    fetch: (req: Request) => Promise<Response> | Response;
  }
}

declare module 'npm:hono/cors' {
  export function cors(options?: any): any;
}

declare module 'npm:hono/logger' {
  export function logger(fn?: any): any;
}

declare module 'jsr:@supabase/supabase-js@2' {
  export function createClient(url: string, key: string, options?: any): any;
}

declare module 'npm:xlsx@0.18.5' {
  const x: any;
  export default x;
}

declare module 'npm:jszip' {
  const JSZip: any;
  export default JSZip;
}

declare const Deno: {
  env: { get(key: string): string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};