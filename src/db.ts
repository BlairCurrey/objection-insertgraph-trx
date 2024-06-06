import { Model } from "objection";
import Knex from "knex";
const knexConfig = require("../knexfile");

const knex = Knex(knexConfig.development);

Model.knex(knex);

export default knex;
