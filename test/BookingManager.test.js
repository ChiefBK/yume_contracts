const BookingManager = artifacts.require("BookingManager");

require('chai').use(require('chai-as-promised')).should();

contract('BookingManager', function([account1, account2, account3]) {
    let bookingManager;

    before(async () => {
        bookingManager = await BookingManager.new();
    });

    it('has no bookings', async () => {
        assert.equal(await bookingManager.numOfBookings(), 0);
        assert.equal(await bookingManager.bookingIndex(), 1);
    });

    describe('Contract Deployment', async () => {
        it('has a name', async () => {
            assert.equal(await bookingManager.name(), 'Booking Manager');
        });
    });

    describe('#createBooking', async () => {
        const startDate = 1625443200, // 2021-July-5
            endDate = 1625702400, // 2021-July-8
            listingId = 0;

        before(async () => {
            await bookingManager.createBooking(listingId, startDate, endDate, { from: account1 })
        });

        it('has created one booking', async () => {
            assert.equal(await bookingManager.numOfBookings(), 1);
            assert.equal(await bookingManager.bookingIndex(), 2);
        });

        describe('Created Listing', async () => {
            it('has correct properties', async () => {
                 assert.equal(await bookingManager.getBookingStart(1), startDate);
                 assert.equal(await bookingManager.getBookingEnd(1), endDate);
                 assert.equal(await bookingManager.getBookingOwner(1), account1);
            });

            it('has correctly booked dates for listing', async () => {
                assert.equal(await bookingManager.getBookingOnDate(listingId, startDate), 1);
            });
        });
    });
});
