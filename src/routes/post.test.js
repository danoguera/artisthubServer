require('dotenv').config();
const req = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const bcrypt = require('bcryptjs');

describe('post', () => {
    let token; //Aqui almacenamos le token que usaremos en todas las pruebas

    beforeEach(async () => {
        for (let collection  in mongoose.connection.collections){
         await mongoose.connection.collections[collection].deleteMany({});   
        }
    });

    beforeAll(async done => {
        const user = {email:"jairo1@test.com", 
        password: "12345",
        username:"jhhernan", name:"Jairo", lastname:"Hernandez"};
        const auth = await req(app).post("/users/signup").send(user);
        token = auth.body;
        done();
    })

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('should list all posts', async done => {

        const query = await req(app).get("/posts").set("Authorization",token);

        expect(query.statusCode).toBe(200);
        expect(query.body).toHaveLength(0);
        done();
    });
    
    it('should display an error message if a bad token is used', async done => {
        const token = "badtoken";
        const query = await req(app).get("/posts").set("Authorization",token);
        
        expect(query.statusCode).toBe(401);
        expect(query.body).toHaveProperty("message", "jwt malformed");
        done();
    });

    it('should display an error message if a expired token is used', async done => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZWE1MmJjYjg4ZTI1M2E1YjY3MmJlNiIsImlhdCI6MTU5MjQxNDkwOCwiZXhwIjoxNTkyNDE4NTA4fQ.yx2XnYj2VWpxmacrN61ksR2nJiV_WwfkVJK1vBJr_zc";
        const query = await req(app).get("/posts").set("Authorization",token);
        
        expect(query.statusCode).toBe(401);
        expect(query.body).toHaveProperty("message", "jwt expired");
        done();
    });

    it('should create a new post', async done => {
        
        const res = await req(app).post("/posts").set("Authorization",token)
        .field('title', "New Title")
        .field('description', "New description")
        .attach('photo', 'public/uploads/images/test.jpg');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("title", "New Title");
        done();
    });

    it('shouldnt create a new post if title is missing', async done => {
        
        const res = await req(app).post("/posts").set("Authorization",token)
        .field('description', "New description")
        .attach('photo', 'public/uploads/images/test.jpg');
    
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("message", "Post validation failed: title: A title is required");
        done();
    });


    it('should update the title of an existing post', async done => {
        //Se podria crear con mongoose directamente, pero preferimos con 
        //este metodo para que quede con el owner de una vez
        const res = await req(app).post("/posts").set("Authorization",token)
        .field('title', "New Title")
        .field('description', "New description")
        .attach('photo', 'public/uploads/images/test.jpg');
        const post_id = res.body._id;
        
        const update = await req(app).put("/posts/"+post_id).set("Authorization",token)
        .field('title', "Updated Title");

        //Ojo, en el auth no estamos validando que el suuario efectivamente exista. OJO
        expect(update.statusCode).toBe(200);
        expect(update.body).toHaveProperty("title", "Updated Title");
        done();
    });

    it('should update the image of an existing post', async done => {
        const res = await req(app).post("/posts").set("Authorization",token)
        .field('title', "New Title")
        .field('description', "New description")
        .attach('photo', 'public/uploads/images/test.jpg');
        const post_id = res.body._id;
        
        const update = await req(app).put("/posts/"+post_id).set("Authorization",token)
        .attach('photo', 'public/uploads/images/test2.jpg');

        expect(update.statusCode).toBe(200);
        expect(update.body).toHaveProperty("title");
        done();
    });

    it('should delete an existing post', async done => {
        //Se podria crear con mongoose directamente, pero preferimos con 
        //este metodo para que quede con el owner de una vez
        const res = await req(app).post("/posts").set("Authorization",token)
        .field('title', "New Title")
        .field('description', "New description")
        .attach('photo', 'public/uploads/images/test.jpg');
        const post_id = res.body._id;
        
        const update = await req(app).delete("/posts/"+post_id).set("Authorization",token);
        
        expect(update.statusCode).toBe(200);
        expect(update.body).toHaveProperty("title", "New Title");
        done();
    });

    it('should show  an specific post', async done => {
        const res = await req(app).post("/posts").set("Authorization",token)
        .field('title', "New Title 1")
        .field('description', "New description")
        .attach('photo', 'public/uploads/images/test.jpg');
        const post_id = res.body._id;
        
        const update = await req(app).get("/posts/"+post_id).set("Authorization",token);
        
        expect(update.statusCode).toBe(200);
        expect(update.body).toHaveProperty("title", "New Title 1");
        done();
    });


    it('should show all posts of a subcategory', async done => {

        const res = await req(app).post("/posts").set("Authorization",token)
        .field('title', "Title")
        .field('description', "New description")
        .field("category", "photography")
        .field("subcategory", "wedding")
        .attach('photo', 'public/uploads/images/test.jpg');
        const post_id = res.body._id;
        
        const update = await req(app).get("/posts/subcategory/wedding").set("Authorization",token);
        
        expect(update.statusCode).toBe(200);
        expect(update.body[0]).toHaveProperty("subcategory", "wedding");
        expect(update.body).toHaveLength(1);
        done();
    });

    it('should show all posts of a category', async done => {

        const res = await req(app).post("/posts").set("Authorization",token)
        .field('title', "Title")
        .field('description', "New description")
        .field("category", "photography")
        .field("subcategory", "wedding")
        .attach('photo', 'public/uploads/images/test.jpg');
        const post_id = res.body._id;
        
        const update = await req(app).get("/posts/category/photography").set("Authorization",token);
        
        expect(update.statusCode).toBe(200);
        expect(update.body[0]).toHaveProperty("category", "photography");
        expect(update.body).toHaveLength(1);
        done();
    });

    it('should show posts of a category/subcategory', async done => {

        const res = await req(app).post("/posts").set("Authorization",token)
        .field('title', "Title")
        .field('description', "New description")
        .field("category", "photography")
        .field("subcategory", "wedding")
        .attach('photo', 'public/uploads/images/test.jpg');
        const post_id = res.body._id;
        
        const update = await req(app).get("/posts/photography/wedding").set("Authorization",token);
        
        expect(update.statusCode).toBe(200);
        expect(update.body[0]).toHaveProperty("category", "photography");
        done();
    });

});