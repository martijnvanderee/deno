import 'jsr:@std/dotenv/load';
import { Application, Router, type Request, Context } from '@oak/oak';
import { oakCors } from "@tajpouria/cors";
import Stripe from "stripe"

const router = new Router();

const whitelist = ["http://localhost:5173", "http://localhost:5173/", "http://vue-frontend-wjofai-d643e5-168-119-233-159.traefik.me"];

const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') ?? ""
const port = parseInt(Deno.env.get('PORT') ?? "8000")

const stripe = new Stripe(stripeKey)

interface Items {
  amount: number
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
  .post("/create-payment-intent", oakCors(corsOptionsDelegate), async (ctx: Context, next) => {

    const body = await ctx.request.body.json()


    const session = await stripe.checkout.sessions.create({
      success_url: 'http://localhost:5173/succes',
      line_items: [
        {
          price: 'price_1PSQDBDh7es2g3cd0ynjrjt3',
          quantity: 2,
        },
      ],
      mode: 'payment',
    });

    ctx.response.body = session.url
    await next();
  }).get("/list-of-products", async (ctx: Context, next) => {

    const products = await stripe.products.list({
      limit: 10,
    });

    ctx.response.body = products.data
    await next();
  })


const app = new Application();
app.use(router.routes());
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.allowedMethods());

console.log(`listen to port ${port}`)
app.listen({ port });
