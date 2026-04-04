const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { loginAdmin } = require('../controllers/adminController');

const { expect } = chai;

describe('adminController', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('loginAdmin', () => {
    it('returns admin profile and token on valid credentials', async () => {
      const req = { body: { username: 'root', password: 'secret' } };
      const fakeAdmin = { id: 'a1', username: 'root', email: 'root@example.com', role: 'super' };
      sinon.stub(Admin, 'findOne').resolves(fakeAdmin);
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign').returns('admin-token');
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

      await loginAdmin(req, res);

      expect(res.status.called).to.be.false;
      expect(res.json.calledOnceWithExactly({
        id: 'a1',
        username: 'root',
        email: 'root@example.com',
        role: 'super',
        token: 'admin-token',
      })).to.be.true;
    });

    it('returns 401 when username is unknown', async () => {
      sinon.stub(Admin, 'findOne').resolves(null);
      const req = { body: { username: 'ghost', password: 'x' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

      await loginAdmin(req, res);

      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.calledOnceWithExactly({ message: 'Invalid admin username or password' })).to.be.true;
    });

    it('returns 500 on database error', async () => {
      sinon.stub(Admin, 'findOne').rejects(new Error('DB Error'));
      const req = { body: { username: 'root', password: 'secret' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

      await loginAdmin(req, res);

      expect(res.status.calledOnceWithExactly(500)).to.be.true;
      expect(res.json.calledOnceWithExactly({ message: 'DB Error' })).to.be.true;
    });
  });
});