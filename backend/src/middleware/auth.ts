import { Hono } from "hono";
import {sign,decode,verify} from 'hono/jwt'

// we cannot have access to the evn globally so initialise into the routes it is in "c"=>context
const app = new Hono<{
  Bindings:{
    DATABASE_URL:string,
    JWT_SECRET:string
  }    
}>();
