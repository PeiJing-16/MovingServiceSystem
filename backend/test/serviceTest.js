const chai = require('chai');
const sinon = require('sinon');
const Service = require('../models/Service');
const { createService, getServices, updateService, deleteService, } =
    require('../controllers/serviceController');

const { expect } = chai;

describe('serviceController', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('createService', () => {
        it('adds a service and returns 201', async () => {
            const req = { body: { name: 'Packing', price: 120 } };
            const created = { id: 's1', ...req.body };
            sinon.stub(Service, 'create').resolves(created);
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await createService(req, res);

            expect(res.status.calledOnceWithExactly(201)).to.be.true;
            expect(res.json.calledOnceWithExactly(created)).to.be.true;
        });
    });

    describe('getServices', () => {
        it('returns all the services', async () => {
            const results = [{ id: 's1' }, { id: 's2' }];
            const sortStub = sinon.stub().resolves(results);
            sinon.stub(Service, 'find').returns({ sort: sortStub });
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await getServices({}, res);

            expect(sortStub.calledOnceWithExactly({ createdAt: -1 })).to.be.true;
            expect(res.json.calledOnceWithExactly(results)).to.be.true;
        });
    });

    describe('updateService', () => {
        it('updates the service and returns the updated service', async () => {
            const service = {
                name: 'Old',
                description: 'Old desc',
                price: 100,
                save: sinon.stub().resolvesThis(),
            };
            sinon.stub(Service, 'findById').resolves(service);
            const req = { params: { id: 's1' }, body: { name: 'New', price: 150 } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await updateService(req, res);

            expect(service.name).to.equal('New');
            expect(service.price).to.equal(150);
            expect(service.save.calledOnce).to.be.true;
            expect(res.json.calledOnceWithExactly(service)).to.be.true;
        });

        it('returns 404 when service missing', async () => {
            sinon.stub(Service, 'findById').resolves(null);
            const req = { params: { id: 'missing' }, body: {} };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await updateService(req, res);

            expect(res.status.calledOnceWithExactly(404)).to.be.true;
            expect(res.json.calledOnceWithExactly({ message: 'Service not found' })).to.be.true;
        });
    });

    describe('deleteService', () => {
        it('removes service and confirms message', async () => {
            sinon.stub(Service, 'findByIdAndDelete').resolves({ id: 's1' });
            const req = { params: { id: 's1' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await deleteService(req, res);

            expect(res.json.calledOnceWithExactly({ message: 'Service removed' })).to.be.true;
        });

        it('returns 404 when deleting unknown service', async () => {
            sinon.stub(Service, 'findByIdAndDelete').resolves(null);
            const req = { params: { id: 'missing' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await deleteService(req, res);

            expect(res.status.calledOnceWithExactly(404)).to.be.true;
            expect(res.json.calledOnceWithExactly({ message: 'Service not found' })).to.be.true;
        });
    });
});