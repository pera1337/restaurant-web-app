import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { Restaurant } from "./entities/Restaurant";
import { RestaurantResolver } from "./resolvers/restaurant";

const app = express();

const main = async () => {
  const connection = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "restaurants",
    logging: false,
    entities: [Restaurant],
    migrations: [path.join(__dirname, "./migrations/*")],
  });

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [RestaurantResolver],
      validate: false,
    }),
    context: { connection },
  });
  app.use(cors());
  app.use(express.json());

  server.applyMiddleware({ app });

  const port = Number(process.env.PORT) || 4000;
  app.listen(port, () => console.log(`Listening on port ${port}...`));
};

main();
