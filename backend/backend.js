import {
  Application,
  Router,
  send,
} from "https://deno.land/x/oak@v6.3.1/mod.ts";

const app = new Application();
const router = new Router();

var cards = [
  {
    id: 0,
    title: "Test Title 1",
    text: "Test Text 1",
    position: 0
  },
  {
    id: 1,
    title: "Test Title 2",
    text: "Test Text 2",
    position: 1
  },
  {
    id: 2,
    title: "Test Title 3",
    text: "Test Text 3",
    position: 2
  }
];

var lanes = [
  {
    id: 0,
    title: "To-Do",
    tag: "todo"
  },
  {
    id: 1,
    title: "In-Progress",
    tag: "in-progess"
  },
  {
    id: 2,
    title: "Done",
    tag: "done"
  }
]

router
  .get("/api/LoadLanes", (context) => {
    context.response.status = 200;
    context.response.body = lanes;
  })
  .get("/api/LoadCards", (context) => {
    context.response.status = 200;
    context.response.body = cards;
  })
  .get("/api/LoadCard/:id", (context) => {
    var id = context.params.id;
    var card = cards.filter((card) => card.id == id);
    context.response.status = 200;
    context.response.body = card;
  })
  .post("/api/AddCard", async (context) => {
    addCard(context);
    context.response.status = 200;
    context.response.body = {message: "Success"};
  })
  .delete("/api/DelCard/:id", (context) => {
    deleteCard(context);
    context.response.status = 200;
    context.response.body = {message: "Success"};
  })
  .patch("/api/MovCard/:id", async (context) => {
    updateCard(context);
    context.response.status = 200;
    context.response.body = {message: "Success"};
  });

app.use(router.routes());
app.use(async (context) => {
  await send(context, context.request.url.pathname, {
    root: `${Deno.cwd()}/frontend`,
    index: "index.html",
  });
});
app.listen({ port: 8000 });

async function addCard(context) {
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

async function updateCard(context) {
  var card = await context.request.body({ type: "json" }).value;
  var id = context.params.id;
  var index = cards.findIndex((card) => card.id == id);
  cards[index] = card;
}
