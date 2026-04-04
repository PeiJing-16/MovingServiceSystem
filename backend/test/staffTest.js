const chai = require('chai');
const sinon = require('sinon');
const Staff = require('../models/Staff');
const { getStaffMembers, createStaffMember, updateStaffMember, deleteStaffMember, } =
    require('../controllers/staffController');

const { expect } = chai;

describe('staffController', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('getStaffMembers', () => {
        it('returns all staff members', async () => {
            const sorted = [{ id: 'st1' }];
            const sortStub = sinon.stub().resolves(sorted);
            sinon.stub(Staff, 'find').returns({ sort: sortStub });
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await getStaffMembers({}, res);

            expect(sortStub.calledOnceWithExactly({ createdAt: -1 })).to.be.true;
            expect(res.json.calledOnceWithExactly(sorted)).to.be.true;
        });
    });

    describe('createStaffMember', () => {
        it('adds staff and responds 201', async () => {
            const req = { body: { name: 'Mover', role: 'Driver' } };
            const created = { id: 'st1', ...req.body };
            sinon.stub(Staff, 'create').resolves(created);
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await createStaffMember(req, res);

            expect(res.status.calledOnceWithExactly(201)).to.be.true;
            expect(res.json.calledOnceWithExactly(created)).to.be.true;
        });
    });

    describe('updateStaffMember', () => {
        it('updates staff member information or availability and saves changes', async () => {
            const staff = {
                name: 'Old',
                role: 'Loader',
                phone: '000',
                status: 'inactive',
                assignedBookings: [],
                save: sinon.stub().resolvesThis(),
            };
            sinon.stub(Staff, 'findById').resolves(staff);
            const req = {
                params: { id: 'st1' },
                body: { role: 'Driver', phone: '999', status: 'active', assignedBookings: ['b1'] },
            };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await updateStaffMember(req, res);

            expect(staff.role).to.equal('Driver');
            expect(staff.phone).to.equal('999');
            expect(staff.status).to.equal('active');
            expect(staff.assignedBookings).to.deep.equal(['b1']);
            expect(staff.save.calledOnce).to.be.true;
            expect(res.json.calledOnceWithExactly(staff)).to.be.true;
        });

        it('returns 404 when staff missing', async () => {
            sinon.stub(Staff, 'findById').resolves(null);
            const req = { params: { id: 'missing' }, body: {} };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await updateStaffMember(req, res);

            expect(res.status.calledOnceWithExactly(404)).to.be.true;
            expect(res.json.calledOnceWithExactly({ message: 'Staff not found' })).to.be.true;
        });
    });

    describe('deleteStaffMember', () => {
        it('removes staff member and confirms message', async () => {
            sinon.stub(Staff, 'findByIdAndDelete').resolves({ id: 'st1' });
            const req = { params: { id: 'st1' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await deleteStaffMember(req, res);

            expect(res.json.calledOnceWithExactly({ message: 'Staff removed' })).to.be.true;
        });

        it('returns 404 when removing unknown staff', async () => {
            sinon.stub(Staff, 'findByIdAndDelete').resolves(null);
            const req = { params: { id: 'missing' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await deleteStaffMember(req, res);

            expect(res.status.calledOnceWithExactly(404)).to.be.true;
            expect(res.json.calledOnceWithExactly({ message: 'Staff not found' })).to.be.true;
        });
    });
});