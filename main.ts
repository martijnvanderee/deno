import 'jsr:@std/dotenv/load';
import { Application, Router } from '@oak/oak';
import { oakCors } from "@tajpouria/cors";


import data from "./data.json" with { type: "json" };

const router = new Router();

const PORT = Deno.env.get('PORT') || 8000;

router
  .get('/', (context) => {
    context.response.body = 'Welcome to dinosaur API! 1';
  })
  .get('/dinosaurs', (context) => {
    context.response.body = data;
  })
  .get('/dinosaurs/:dinosaur', (context) => {
    if (!context?.params?.dinosaur) {
      context.response.body = 'No dinosaur name provided.';
    }

    const dinosaur = data.find(
      (item) =>
        item.name.toLowerCase() === context.params.dinosaur.toLowerCase()
    );
  
    context.response.body = dinosaur ? dinosaur : 'No dinosaur found.';
  });

  

const app = new Application();
app.use(oakCors({origin:"http://vue-frontend-wjofai-d643e5-168-119-233-159.traefik.me"})); 
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8000 });
