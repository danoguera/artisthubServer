require('dotenv').config();
const req = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const bcrypt = require('bcryptjs');

describe ('provider', () => {

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

    it('should signup a new provider ', async done => {
        const user = {email:"provider1@test.com", 
                    password: "12345",
                    username:"jhhernan", name:"Jairo", lastname:"Hernandez"};

        const res = await req(app).post("/provider/signup").send(user);
        expect(res.statusCode).toBe(200);
        done();
        
    });

    it('shouldnt signup a new provider if username missing', async done => {
        const user = {email:"provider1@test.com", 
                    password: "12345",
                    name:"Jairo", lastname:"Hernandez"};

        const res = await req(app).post("/provider/signup").send(user);
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch("Provider validation failed: username: Username is required");
        done();
     });

    it('shouldnt signup a new provider if email missing', async done => {
        const user = {
            password: "12345",
            name: "Jairo", lastname: "Hernandez"
        };

        const res = await req(app).post("/provider/signup").send(user);
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch("Please include email");
        done();
    });

    it('shouldnt signup a new provider if password is missing', async done => {
        const user = {
            email: "provider1@test.com",
            name: "Jairo", lastname: "Hernandez"
        };

        const res = await req(app).post("/provider/signup").send(user);
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch("Please include password");
        done();
    });


    it('shouldnt sign in a provider if email is wrong', async done => {
        const password = await bcrypt.hash("12345",8);
        const user = {email:"provider@test.com", password, username:"jhhernan", name:"Jairo", lastname:"Hernandez"};
        await mongoose.models.Provider.create(user);

        const res = await req(app).post("/provider/signin").send({
            email:"jairo111@test.com",
            password:"12345"
        });
        
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("message","Wrong user/password");
        done();
    })

    it('shouldnt sign in a provider if password is wrong', async done => {
        const password = await bcrypt.hash("12345",8);
        const user = {email:"provider@test.com", password, username:"jhhernan", name:"Jairo", lastname:"Hernandez"};
        await mongoose.models.Provider.create(user);

        const res = await req(app).post("/provider/signin").send({
            email:"provider@test.com",
            password:"123"
        });
        
        expect(res.statusCode).toBe(401);
        expect(res.body).toMatch("Wrong user/password");
        done();
    })

  
    it('should sign in a user if email/password are OK', async done => {
        const password = await bcrypt.hash("12345",8);
        const user = {email:"provider@test.com", password, username:"jhhernan", name:"Jairo", lastname:"Hernandez"};
        await mongoose.models.Provider.create(user);

        const res = await req(app).post("/provider/signin").send({
            email:"provider@test.com",
            password:"12345"
        });
        
        expect(res.statusCode).toBe(200);
        done();
        
    });

    it('should list all providers in db', async done => {
          const user = {email:"provider@test.com", 
                      password: "12345",
                      username:"jhhernan", name:"Jairo", lastname:"Hernandez"};

          const auth = await req(app).post("/provider/signup").send(user);
          const token = auth.body;

         const res = await req(app).get("/provider").set("Authorization", token);
         
         let response = res.body;
         response= response[0];

         expect(res.statusCode).toBe(200);
         expect(response).toHaveProperty("email", "provider@test.com");
         done();
    });    
  

    it('should update an existing provider', async done => {
        const user = {
            email: "provider@test.com",
            password: "12345",
            username: "jhhernan", name: "Jairo", lastname: "Hernandez"
        };

        const auth = await req(app).post("/provider/signup").send(user);
        const token = auth.body;

        const res = await req(app).put("/provider").set("Authorization", token).send({ name: "Peter" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("name", "Peter");
        done();
    });   

    it('should delete an existing provider', async done => {
        const user = {
            email: "provider@test.com",
            password: "12345",
            username: "jhhernan", name: "Jairo", lastname: "Hernandez"
        };

        const auth = await req(app).post("/provider/signup").send(user);
        const token = auth.body;

        const res = await req(app).delete("/provider").set("Authorization", token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("email", "provider@test.com");
        done();
    });   

    it('should show the details of the provider', async done => {
        const user = {
            email: "provider@test.com",
            password: "12345",
            username: "jhhernan", name: "Jairo", lastname: "Hernandez"
        };

        const auth = await req(app).post("/provider/signup").send(user);
        const token = auth.body;

        const res = await req(app).get("/provider/get").set("Authorization", token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("email", "provider@test.com");
        done();
    });   

});