import {
  Application,
  Router,
  send,
} from "https://deno.land/x/oak@v6.3.1/mod.ts";

const app = new Application();
const router = new Router();

var cards = [];

router
  .get("/api/LoadCards", (context) => context.response.body = cards)
  .post("/api/AddCard", async (context) => {
    addCard(context);
  })
  .delete("/api/DelCard:id", (context) => {
    deleteCard(context);
  })
  .patch("/api/MovCard:id", async (context) => {
    updateCard(context);
  });

app.use(router.routes());
app.use(async (context) => {
  await send(context, context.request.url.pathname, {
    root: `${Deno.cwd()}/frontend`,
    index: "index.html",
  });
});
app.listen({ port: 8000 });

function addCard(context) {
  var card = await context.request.body({ type: "json" }).value;
  cards = [
    ...cards,
    card,
  ];
}

function deleteCard(context) {
  var id = context.params.id;
  cards = cards.filter((card) => card.id != id);
}

function updateCard(context) {
  var card = await context.request.body({ type: "json" }).value;
  var id = context.params.id;
  var index = cards.findIndex((card) => card.id == id);
  cards[index] = card;
}
