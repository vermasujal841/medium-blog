import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign,decode,verify} from 'hono/jwt' 
import {signupInput,signinInput} from 'kingsmen-mediumcommon'

export const userRouter=new Hono<{
  Bindings:{
    DATABASE_URL:string,
    JWT_SECRET:string
  }
}>();
userRouter.post('/signup', async (c) => {
  const body = await c.req.json();
  const parseBody=signinInput.safeParse(body);
    const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL,     //the env variable is injected through wrangler.toml
    }).$extends(withAccelerate())
    if(!parseBody.success){
      c.status(411);
      return c.json({
        message:"invalid input"
      })
    }
    
    try {
      const user = await prisma.user.create({
        data:{
          email:body.email,
          password:body.password,
          name:body.name
        },
      }) 
      const token = await sign({id:user.id},c.env.JWT_SECRET);
    
      return c.json({
        jwt:token
      })
    } catch (e) {
      c.status(403);
      return c.json({error:"error while signing up"});
    }
  })
  
  
  
  
  userRouter.post('/signin', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL,     //the env variable is injected through wrangler.toml
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const parseBody=signupInput.safeParse(body);
    if(!parseBody.success){
      c.status(411);
      return c.json({
        message:"invalid input"
      })
    }
    try {
      const user = await prisma.user.findUnique({
        where:{
          email:body.email,
          password:body.password
        }
      });
      if(!user){
        c.status(403);
        return c.json({error:"user not form"})
      } 
      const jwt = await sign({id:user.id},c.env.JWT_SECRET);
      return c.json({jwt});
    } catch (error) {
      c.status(411)
      return c.text('Invalid creds')
    }
  })