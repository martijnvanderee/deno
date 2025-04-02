import 'jsr:@std/dotenv/load';
import { Application, Router, type Request, Context } from '@oak/oak';
import { oakCors } from "@tajpouria/cors";
import Stripe from "stripe"
import data from "./data.json" with { type: "json" };

const router = new Router();

const PORT = Deno.env.get('PORT') || 8000;

const whitelist = ["http://localhost:5173", "http://vue-frontend-wjofai-d643e5-168-119-233-159.traefik.me"];

const stripe = new Stripe('sk_test_51LAUyaDh7es2g3cdlcOSPfoSHIjgtb0UlG3B8lXF5Ik44wms9bzepBcDETapv1bJP2rO5FXnv4Cm56kfWWClBOCU00ITvmuMAw')


interface Items {
  amount: number
}

interface MyRequestBody {
  items: string;
}

const calculateOrderAmount = (items: Items[]) => {
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  let total = 0;
  items.forEach((item) => {
    total += item.amount;
  });
  return total;
};

const corsOptionsDelegate = (request: Request) => {
  const isOriginAllowed = whitelist.includes(
    request.headers.get("origin") ?? "",
  );

  return { origin: isOriginAllowed };
};

router
  .get('/', (context) => {
    context.response.body = 'Welcome to dinosaur API! 2';
  })
  .get('/dinosaurs', oakCors(corsOptionsDelegate), (context) => {
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
  })

router.post("/create-payment-intent", oakCors(corsOptionsDelegate), async (ctx: Context) => {
  console.log("test")
  const { items } = ctx.request.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "eur",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  console.log("test1")
  ctx.response.body = {
    clientSecret: paymentIntent.client_secret,
  }

  console.log("test2")
})


const app = new Application();
app.use(oakCors({ origin: "http://vue-frontend-wjofai-d63e5-168-119-233-159.traefik.me" }));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8000 });

const a = 4;