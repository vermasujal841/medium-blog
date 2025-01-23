import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign,decode,verify} from 'hono/jwt'
import {createPostInput,updatePostInput} from 'kingsmen-mediumcommon'

export const blogRouter=new Hono<{
    Bindings:{
      DATABASE_URL:string,
      JWT_SECRET:string
    },
    Variables:{
      userId:string;
    }
  }>();
  blogRouter.get('/bulk', async(c) => {
    
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,     //the env variable is injected through wrangler.toml
      }).$extends(withAccelerate())
      const posts=await prisma.post.findMany({});
      return c.json({  
        posts
      })
  })
  blogRouter.use("/*", async (c, next) => {
    // Extract the userId
    const authHeader = c.req.header("authorization") || "";
  
    try {
      const user = await verify(authHeader, c.env.JWT_SECRET);
      if (user) {
        // Set userId in locals 
        // @ts-ignore
        c.set("userId", user.id);
        await next();
      } else {
        c.status(403);
        return c.json({
          message: "You are not logged in",
        });
      }
    } catch (error) {
      c.status(403);
      return c.json({
        message: "Invalid token",
      });
    }
  });
blogRouter.get('/:id',async(c) => {
  const id=c.req.param("id");
  
  const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL,     //the env variable is injected through wrangler.toml
    }).$extends(withAccelerate())
    try {
      const post = await prisma.post.findFirst({
        where:{
          id:id
        }
      })
      return c.json({
        post
      })
    } catch (error) {
      c.status(411);
      return c.json({
        message:"erroe while fetching blog post"
      })
    }
    
  })
  
  blogRouter.post('/', async(c) => {
    const body = await c.req.json();
    const parseBody=createPostInput.safeParse(body);
        if(!parseBody.success){
          c.status(411);
          return c.json({
            message:"invalid input"
          })
        }
    const authorId=c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,     //the env variable is injected through wrangler.toml
      }).$extends(withAccelerate())
     try {
       const post = await prisma.post.create({
         data:{
             title:body.title,
             content:body.content,
             authorId:authorId
         }
       })
       return c.json({
         id:post.id
       })
     } catch (error) {
      c.status(411);
      return c.json({
        message:"error while posting blog post"
      })
     }
  })
  
  blogRouter.put('/', async(c) => { 
    const body = await c.req.json();
    const parseBody=updatePostInput.safeParse(body);
        if(!parseBody.success){
          c.status(411);
          return c.json({
            message:"invalid input"
          })
        }
    
    const authorId=c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,     //the env variable is injected through wrangler.toml
      }).$extends(withAccelerate())
     try {
       const post = await prisma.post.update({
         where:{
           id:body.id
         },
         data:{
             title:body.title,
             content:body.content,
             authorId:authorId
         }
       })
       return c.json({
         id:post.id
       })
     } catch (error) {
      c.status(411);
      return c.json({
        message:"erroe while updating blog post"
      })
     }
  })


