const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');

const {
    createBooking,
    getBookings,
    updateBooking,
    adminUpdateBooking,
    deleteBooking,
} = require('../controllers/bookingController');

const { expect } = chai;

describe('bookingController', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('createBooking', () => {
        it('should create a new booking successfully', async () => {
            const userId = new mongoose.Types.ObjectId().toString();
            const bookingId = new mongoose.Types.ObjectId();

            const req = {
                user: { id: userId },
                body: {
                    serviceType: 'Home Relocation',
                    propertyType: 'House',
                    pickupAddress: '123 Main St',
                    destinationAddress: '456 Elm St',
                    date: '2026-04-15',
                    time: '10:00',
                    remarks: 'Handle with care',
                    inventoryItems: ['item1'],
                    customItems: 'Sofa, Table',
                },
            };

            const expectedBookingData = {
                ...req.body,
                user: userId,
                inventoryItems: ['item1'],
                customItems: ['Sofa', 'Table'],
            };

            const createdBooking = {
                _id: bookingId,
                ...expectedBookingData,
            };

            const populatedBooking = {
                ...createdBooking,
                inventoryItems: [
                    {
                        _id: 'item1',
                        itemName: 'Sofa',
                        category: 'Furniture',
                        isActive: true,
                    },
                ],
            };

            const createStub = sinon.stub(Booking, 'create').resolves(createdBooking);

            const populateStub = sinon.stub().resolves(populatedBooking);
            const findByIdStub = sinon.stub(Booking, 'findById').returns({
                populate: populateStub,
            });

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            await createBooking(req, res);

            expect(createStub.calledOnceWithExactly(expectedBookingData)).to.be.true;
            expect(findByIdStub.calledOnceWithExactly(bookingId)).to.be.true;
            expect(
                populateStub.calledOnceWithExactly(
                    'inventoryItems',
                    'itemName category isActive'
                )
            ).to.be.true;
            expect(res.status.calledOnceWithExactly(201)).to.be.true;
            expect(res.json.calledOnceWithExactly(populatedBooking)).to.be.true;
        });

        it('should return 500 when Booking.create throws', async () => {
            sinon.stub(Booking, 'create').rejects(new Error('DB Error'));

            const req = {
                user: { id: 'user123' },
                body: {},
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            await createBooking(req, res);

            expect(res.status.calledOnceWithExactly(500)).to.be.true;
            expect(res.json.calledOnceWithExactly({ message: 'DB Error' })).to.be.true;
        });
    });

    describe('getBookings', () => {
        it('should fetch bookings for the user sorted by newest first', async () => {
            const bookings = [{ _id: '1' }, { _id: '2' }];

            const sortStub = sinon.stub().resolves(bookings);
            const populateStub = sinon.stub().returns({
                sort: sortStub,
            });

            const findStub = sinon.stub(Booking, 'find').returns({
                populate: populateStub,
            });

            const req = {
                user: { id: 'userABC' },
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            await getBookings(req, res);

            expect(findStub.calledOnceWithExactly({ user: 'userABC' })).to.be.true;
            expect(
                populateStub.calledOnceWithExactly(
                    'inventoryItems',
                    'itemName category isActive'
                )
            ).to.be.true;
            expect(sortStub.calledOnceWithExactly({ createdAt: -1 })).to.be.true;
            expect(res.json.calledOnceWithExactly(bookings)).to.be.true;
        });

        it('should return 500 when the query chain rejects', async () => {
            const error = new Error('DB Error');

            const sortStub = sinon.stub().rejects(error);
            const populateStub = sinon.stub().returns({
                sort: sortStub,
            });

            sinon.stub(Booking, 'find').returns({
                populate: populateStub,
            });

            const req = {
                user: { id: 'userXYZ' },
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            await getBookings(req, res);

            expect(res.status.calledOnceWithExactly(500)).to.be.true;
            expect(res.json.calledOnceWithExactly({ message: 'DB Error' })).to.be.true;
        });
    });

    describe('updateBooking (user)', () => {
        it('lets a user modify booking details', async () => {
            const bookingId = 'booking123';

            const newValues = {
                serviceType: 'Packing',
                propertyType: 'Apartment',
                pickupAddress: '99 Demo Rd',
                destinationAddress: '11 Example Ave',
                date: '2026-05-01',
                time: '09:30',
                remarks: 'Handle fragile items',
                inventoryItems: ['item1'],
                customItems: 'Box, Chair',
            };

            const fakeBooking = {
                _id: bookingId,
                serviceType: 'Old',
                propertyType: 'House',
                pickupAddress: 'Old',
                destinationAddress: 'Old',
                date: '2026-04-01',
                time: '08:00',
                remarks: 'None',
                inventoryItems: [],
                customItems: [],
                save: sinon.stub().resolves({
                    _id: bookingId,
                }),
            };

            const populatedBooking = {
                _id: bookingId,
                serviceType: 'Packing',
                propertyType: 'Apartment',
                pickupAddress: '99 Demo Rd',
                destinationAddress: '11 Example Ave',
                date: '2026-05-01',
                time: '09:30',
                remarks: 'Handle fragile items',
                inventoryItems: [
                    {
                        _id: 'item1',
                        itemName: 'Box',
                        category: 'Furniture',
                        isActive: true,
                    },
                ],
                customItems: ['Box', 'Chair'],
            };

            const findOneStub = sinon.stub(Booking, 'findOne').resolves(fakeBooking);

            const populateStub = sinon.stub().resolves(populatedBooking);
            const findByIdStub = sinon.stub(Booking, 'findById').returns({
                populate: populateStub,
            });

            const req = {
                params: { id: bookingId },
                user: { id: 'user123' },
                body: newValues,
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            await updateBooking(req, res);

            expect(
                findOneStub.calledOnceWithExactly({
                    _id: bookingId,
                    user: 'user123',
                })
            ).to.be.true;

            expect(fakeBooking.serviceType).to.equal('Packing');
            expect(fakeBooking.propertyType).to.equal('Apartment');
            expect(fakeBooking.pickupAddress).to.equal('99 Demo Rd');
            expect(fakeBooking.destinationAddress).to.equal('11 Example Ave');
            expect(fakeBooking.date).to.equal('2026-05-01');
            expect(fakeBooking.time).to.equal('09:30');
            expect(fakeBooking.remarks).to.equal('Handle fragile items');
            expect(fakeBooking.inventoryItems).to.deep.equal(['item1']);
            expect(fakeBooking.customItems).to.deep.equal(['Box', 'Chair']);

            expect(fakeBooking.save.calledOnce).to.be.true;
            expect(findByIdStub.calledOnceWithExactly(bookingId)).to.be.true;
            expect(
                populateStub.calledOnceWithExactly(
                    'inventoryItems',
                    'itemName category isActive'
                )
            ).to.be.true;
            expect(res.json.calledOnceWithExactly(populatedBooking)).to.be.true;
        });

        it('returns 404 when the user tries to update a non-existent booking', async () => {
            sinon.stub(Booking, 'findOne').resolves(null);

            const req = {
                params: { id: 'missing' },
                user: { id: 'user999' },
                body: {},
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            await updateBooking(req, res);

            expect(res.status.calledOnceWithExactly(404)).to.be.true;
            expect(res.json.calledOnceWithExactly({ message: 'Booking not found' })).to
                .be.true;
        });
    });

    describe('adminUpdateBooking (admin)', () => {
        it('allows admin to assign staff and change status then returns populated booking', async () => {
            const bookingId = 'bookingABC';

            const fakeBooking = {
                _id: bookingId,
                assignedStaff: ['oldStaff'],
                status: 'pending',
                remarks: 'Initial',
                save: sinon.stub().resolves({
                    _id: bookingId,
                }),
            };

            const populatedBooking = {
                _id: bookingId,
                assignedStaff: [],
                status: 'completed',
                remarks: 'Finished nicely',
            };

            const thirdPopulateStub = sinon.stub().resolves(populatedBooking);
            const secondPopulateStub = sinon.stub().returns({
                populate: thirdPopulateStub,
            });
            const firstPopulateStub = sinon.stub().returns({
                populate: secondPopulateStub,
            });

            const findByIdStub = sinon.stub(Booking, 'findById');

            findByIdStub.onFirstCall().resolves(fakeBooking);
            findByIdStub.onSecondCall().returns({
                populate: firstPopulateStub,
            });

            const req = {
                params: { id: bookingId },
                body: {
                    assignedStaff: null,
                    status: 'completed',
                    remarks: 'Finished nicely',
                },
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            await adminUpdateBooking(req, res);

            expect(findByIdStub.firstCall.calledWithExactly(bookingId)).to.be.true;
            expect(fakeBooking.assignedStaff).to.deep.equal([]);
            expect(fakeBooking.status).to.equal('completed');
            expect(fakeBooking.remarks).to.equal('Finished nicely');
            expect(fakeBooking.save.calledOnce).to.be.true;

            expect(findByIdStub.secondCall.calledWithExactly(bookingId)).to.be.true;
            expect(
                firstPopulateStub.calledOnceWithExactly('user', 'name email phone')
            ).to.be.true;
            expect(
                secondPopulateStub.calledOnceWithExactly(
                    'assignedStaff',
                    'name role phone'
                )
            ).to.be.true;
            expect(
                thirdPopulateStub.calledOnceWithExactly(
                    'inventoryItems',
                    'itemName category isActive'
                )
            ).to.be.true;

            expect(res.json.calledOnceWithExactly(populatedBooking)).to.be.true;
        });

        it('returns 404 when admin tries to update a missing booking', async () => {
            sinon.stub(Booking, 'findById').resolves(null);

            const req = {
                params: { id: 'missingAdmin' },
                body: {},
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            await adminUpdateBooking(req, res);

            expect(res.status.calledOnceWithExactly(404)).to.be.true;
            expect(res.json.calledOnceWithExactly({ message: 'Booking not found' })).to
                .be.true;
        });
    });

    describe('deleteBooking', () => {
        it('should delete booking and confirm removal', async () => {
            const fakeBooking = {
                _id: 'booking999',
                user: 'user999',
            };

            const findOneAndDeleteStub = sinon
                .stub(Booking, 'findOneAndDelete')
                .resolves(fakeBooking);

            const req = {
                params: { id: 'booking999' },
                user: { id: 'user999' },
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            await deleteBooking(req, res);

            expect(
                findOneAndDeleteStub.calledOnceWithExactly({
                    _id: 'booking999',
                    user: 'user999',
                })
            ).to.be.true;
            expect(res.json.calledOnceWithExactly({ message: 'Booking removed' })).to.be
                .true;
        });

        it('should return 500 when Booking.findOneAndDelete rejects', async () => {
            sinon
                .stub(Booking, 'findOneAndDelete')
                .rejects(new Error('DB Error'));

            const req = {
                params: { id: 'oops' },
                user: { id: 'userOops' },
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            await deleteBooking(req, res);

            expect(res.status.calledOnceWithExactly(500)).to.be.true;
            expect(res.json.calledOnceWithExactly({ message: 'DB Error' })).to.be.true;
        });
    });
});