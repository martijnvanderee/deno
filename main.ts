import 'jsr:@std/dotenv/load';
import { Application, Router } from '@oak/oak';

const router = new Router();

const PORT = Deno.env.get('PORT') || 8000;

// const handler = async (req: Request): Promise<Response> => {
//   const url = new URL(req.url);

//   if (url.pathname === '/') {
//     const greeting = Deno.env.get('GREETING') || 'Hello from Deno 1!';
//     return new Response(greeting);
//   } else if (url.pathname === '/greet') {
//     const greeting = Deno.env.get('GREETING') || 'Hello from Deno 2!';
//     return new Response(greeting);
//   } else {
//     return new Response('Not Found', { status: 404 });
//   }
// };

router.get('/', (ctx) => {
  ctx.response.body = 'Hello world';
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8000 });

// router.get('/', (context) => {
//   context.response.body = 'Welcome to dinosaur API!';
// });

// try {
//   Deno.serve({ port: Number(PORT) }, handler);
// } catch (err) {
//   console.error('Error starting the server:', err);
// }
