require('dotenv').config();
const req = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const bcrypt = require('bcryptjs');

describe.only('user', () => {

    beforeEach(async done => {
        for (let collection  in mongoose.connection.collections){
         await mongoose.connection.collections[collection].deleteMany({});   
        }
        done();
    });

    afterAll(async done => {
        await mongoose.disconnect();
        done();
    });

    it('should signup a new user ', async done => {
        const user = {email:"jairo1@test.com", 
                    password: "12345",
                    username:"jhhernan", name:"Jairo", lastname:"Hernandez"};

        const res = await req(app).post("/users/signup").send(user);
        expect(res.statusCode).toBe(200);
        done();
        
    });

    it('shouldnt signup a new user if username missing', async done => {
        const user = {email:"jairo1@test.com", 
                    password: "12345",
                    name:"Jairo", lastname:"Hernandez"};

        const res = await req(app).post("/users/signup").send(user);
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch("User validation failed: username: Username is required");
        done();
     });

     it('shouldnt signup a new user if name is missing', async done => {
        const user = {email:"jairo1@test.com", 
                    password: "12345",
                    username:"jhhernan", lastname:"Hernandez"};

        const res = await req(app).post("/users/signup").send(user);
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch("User validation failed: name: Name is required");
        done();
     });


     it('shouldnt sign in a user if email already exists', async done => {
        const password = await bcrypt.hash("12345",8);
        const user = {email:"jairo@test.com", password, username:"jhhernan", name:"Jairo", lastname:"Hernandez"};
        await mongoose.models.User.create(user);

        const res = await req(app).post("/users/signup").send({
            email:"jairo@test.com",
            password:"123456", username:"jh", name: "Pedro", lastname:"Perez",
        });
        
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch("User validation failed: email: Email already exists");
        done();
    })

    it('shouldnt sign in a user if email is wrong', async done => {
        const password = await bcrypt.hash("12345",8);
        const user = {email:"jairo@test.com", password, username:"jhhernan", name:"Jairo", lastname:"Hernandez"};
        await mongoose.models.User.create(user);

        const res = await req(app).post("/users/signin").send({
            email:"jairo111@test.com",
            password:"123456"
        });
        
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("message","Wrong user/password");
        done();
    })

    it('shouldnt sign in a user if password is wrong', async done => {
        const password = await bcrypt.hash("12345",8);
        const user = {email:"jairo@test.com", password, username:"jhhernan", name:"Jairo", lastname:"Hernandez"};
        await mongoose.models.User.create(user);

        const res = await req(app).post("/users/signin").send({
            email:"jairo@test.com",
            password:"123456"
        });
        
        expect(res.statusCode).toBe(401);
        expect(res.body).toMatch("Wrong user/password");
        done();
    })

  
    it('should sign in a user if email/password are OK', async done => {
        const password = await bcrypt.hash("12345",8);
        const user = {email:"jairo@test.com", password, username:"jhhernan", name:"Jairo", lastname:"Hernandez"};
        await mongoose.models.User.create(user);

        const res = await req(app).post("/users/signin").send({
            email:"jairo@test.com",
            password:"12345"
        });
        
        expect(res.statusCode).toBe(200);
        done();
        
    });

    it('should list all users in db', async done => {
          const user = {email:"jairo1@test.com", 
                      password: "12345",
                      username:"jhhernan", name:"Jairo", lastname:"Hernandez"};

          const auth = await req(app).post("/users/signup").send(user);
          const token = auth.body;

         const res = await req(app).get("/users").set("Authorization", token);
         
         let response = res.body;
         response= response[0];

         expect(res.statusCode).toBe(200);
         expect(response).toHaveProperty("email", "jairo1@test.com");
         done();
    });    
  

    it('should update an existing user', async done => {
        const user = {
            email: "jairo1@test.com",
            password: "12345",
            username: "jhhernan", name: "Jairo", lastname: "Hernandez"
        };

        const auth = await req(app).post("/users/signup").send(user);
        const token = auth.body;

        const res = await req(app).put("/users").set("Authorization", token).send({ username: "jh" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("username", "jh");
        done();
    });   

    it('should delete an existing user', async done => {
        const user = {
            email: "jairo1@test.com",
            password: "12345",
            username: "jhhernan", name: "Jairo", lastname: "Hernandez"
        };

        const auth = await req(app).post("/users/signup").send(user);
        const token = auth.body;

        const res = await req(app).delete("/users").set("Authorization", token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("email", "jairo1@test.com");
        done();
    });   

    it('should show the details of the user', async done => {
        const user = {
            email: "jairo1@test.com",
            password: "12345",
            username: "jhhernan", name: "Jairo", lastname: "Hernandez"
        };

        const auth = await req(app).post("/users/signup").send(user);
        const token = auth.body;

        const res = await req(app).get("/users/get").set("Authorization", token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("email", "jairo1@test.com");
        done();
    });   

});