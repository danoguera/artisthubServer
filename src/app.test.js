require('dotenv').config();
const req = require('supertest');
const app = require('./app');
const mongoose = require('mongoose');

describe('app', () => {

    beforeEach(async () => {
        for (let collection  in mongoose.connection.collections){
         await mongoose.connection.collections[collection].deleteMany({});   
        }
    });

    afterAll(async () => {
        await mongoose.disconnect();
    })

    it("should GET / with success code", async done => {
        const res = await req(app).get("/");
        done();

        expect(res.statusCode).toBe(200);
    })
})