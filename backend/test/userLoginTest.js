const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerUser, loginUser, getProfile, updateUserProfile, deleteUserAccount, } =
    require('../controllers/authController');

const { expect } = chai;

describe('authController', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('registerUser', () => {
        it('creates a user when email is not taken', async () => {
            const req = { body: { name: 'Jane', email: 'jane@test.com', password: 'pw', address: 'address', phone: '0402123456' } };
            sinon.stub(User, 'findOne').resolves(null);
            const createdUser = { id: 'u1', ...req.body };
            sinon.stub(User, 'create').resolves(createdUser);
            sinon.stub(jwt, 'sign').returns('token');
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await registerUser(req, res);

            expect(res.status.calledOnceWithExactly(201)).to.be.true;
            expect(res.json.calledOnceWithExactly({
                id: 'u1',
                name: 'Jane',
                email: 'jane@test.com',
                address: 'address',
                phone: '0402123456',
                token: 'token',
            })).to.be.true;
        });

        it('rejects duplicate emails', async () => {
            sinon.stub(User, 'findOne').resolves({ id: 'exists' });
            const req = { body: { email: 'dup@test.com' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await registerUser(req, res);

            expect(res.status.calledOnceWithExactly(400)).to.be.true;
            expect(res.json.calledOnceWithExactly({ message: 'User already exists' })).to.be.true;
        });
    });

    describe('loginUser', () => {
        it('returns user info and token when credentials match', async () => {
            const req = { body: { email: 'jane@test.com', password: 'pw' } };
            const user = { id: 'u1', name: 'Jane', email: 'jane@test.com', password: 'hashed' };
            sinon.stub(User, 'findOne').resolves(user);
            sinon.stub(bcrypt, 'compare').resolves(true);
            sinon.stub(jwt, 'sign').returns('token');
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await loginUser(req, res);

            expect(res.status.called).to.be.false;
            expect(res.json.calledOnceWithExactly({ id: 'u1', name: 'Jane', email: 'jane@test.com', token: 'token' })).to.be.true;
        });

        it('returns 401 on invalid credentials', async () => {
            sinon.stub(User, 'findOne').resolves(null);
            const req = { body: { email: 'bad@test.com', password: 'pw' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await loginUser(req, res);

            expect(res.status.calledOnceWithExactly(401)).to.be.true;
            expect(res.json.calledOnceWithExactly({ message: 'Invalid email or password' })).to.be.true;
        });
    });

    describe('getProfile', () => {
        it('returns profile when user exists', async () => {
            const user = { id: 'u1', name: 'Jane', email: 'jane@test.com', address: 'address', phone: '0402123456' };
            sinon.stub(User, 'findById').resolves(user);
            const req = { user: { id: 'u1' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await getProfile(req, res);

            expect(res.status.calledOnceWithExactly(200)).to.be.true;
            expect(res.json.calledOnceWithExactly({
                name: 'Jane',
                email: 'jane@test.com',
                address: 'address',
                phone: '0402123456',
            })).to.be.true;
        });

        it('returns 404 when profile missing', async () => {
            sinon.stub(User, 'findById').resolves(null);
            const req = { user: { id: 'missing' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await getProfile(req, res);

            expect(res.status.calledOnceWithExactly(404)).to.be.true;
            expect(res.json.calledOnceWithExactly({ message: 'User not found' })).to.be.true;
        });
    });

    describe('updateUserProfile', () => {
        it('updates mutable fields and returns new token', async () => {
            const original = {
                id: 'u1',
                name: 'Jane',
                email: 'old@test.com',
                address: 'Old',
                phone: '000',
                save: sinon.stub().resolvesThis(),
            };
            sinon.stub(User, 'findById').resolves(original);
            sinon.stub(jwt, 'sign').returns('new-token');
            const req = { user: { id: 'u1' }, body: { email: 'new@test.com', phone: '999' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await updateUserProfile(req, res);

            expect(original.email).to.equal('new@test.com');
            expect(original.phone).to.equal('999');
            expect(original.save.calledOnce).to.be.true;
            expect(res.json.calledOnceWithExactly({
                id: 'u1',
                name: 'Jane',
                email: 'new@test.com',
                address: 'Old',
                phone: '999',
                token: 'new-token',
            })).to.be.true;
        });
    });

    describe('deleteUserAccount', () => {
        it('deletes user and returns confirmation', async () => {
            const user = { deleteOne: sinon.stub().resolves() };
            sinon.stub(User, 'findById').resolves(user);
            const req = { user: { id: 'u1' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await deleteUserAccount(req, res);

            expect(user.deleteOne.calledOnce).to.be.true;
            expect(res.status.calledOnceWithExactly(200)).to.be.true;
            expect(res.json.calledOnceWithExactly({ message: 'Account deleted' })).to.be.true;
        });
    });
});