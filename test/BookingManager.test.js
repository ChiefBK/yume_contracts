const BookingManager = artifacts.require("BookingManager");

require('chai').use(require('chai-as-promised')).should();

contract('BookingManager', function([account1, account2, account3]) {
    let bookingManager;

    beforeEach(async () => {
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
            listingId = 1;

        beforeEach(async () => {
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
                assert.equal(await bookingManager.getBookingOnDate(listingId, 1625788800), 0, 'No booking on 2021-July-9');
            });
        });
    });

    describe('#getBookingsInRange', async () => {
        const startDate1 = 1625443200, // 2021-July-5
            endDate1 = 1625702400, // 2021-July-8
            startDate2 = 1625961600, // 2021-July-11
            endDate2 = 1626048000, // 2021-July-12
            listingId = 1;

        beforeEach(async () => {
            await bookingManager.createBooking(listingId, startDate1, endDate1, { from: account1 })
            await bookingManager.createBooking(listingId, startDate2, endDate2, { from: account1 })
        });

        it('returns the correct listings', async () => {
            const rangeStart = 1625356800; // 2021-July-4
            const rangeEnd = 1626048000; // 2021-July-12
            assert.equal(await bookingManager.getBookingOnDate(listingId, startDate1), 1);
            assert.equal(await bookingManager.getBookingOnDate(listingId, endDate1), 1);
            assert.equal(await bookingManager.getBookingOnDate(listingId, 1625788800), 0, 'No booking on 2021-July-9');
            assert.equal(await bookingManager.getBookingOnDate(listingId, startDate2), 2);
            assert.equal(await bookingManager.getBookingOnDate(listingId, endDate2), 2);

            const bookings = await bookingManager.getBookingsInRange(listingId, rangeStart, rangeEnd);
            assert.equal(bookings.length, 9, 'The 4th thru the 12th contains 9 nights total');
            assert.equal(bookings[0], 0, 'The first is "0" since nothing is booked on the 4th');
            assert.equal(bookings[1], 1, 'This is "1" since listing booking "1" is on this date');
            assert.equal(bookings[2], 1, 'This is "1" since listing booking "1" is on this date');
            assert.equal(bookings[3], 1, 'This is "1" since listing booking "1" is on this date');
            assert.equal(bookings[4], 1, 'This is "1" since listing booking "1" is on this date');
            assert.equal(bookings[5], 0, 'Nothing is booked on this date');
            assert.equal(bookings[6], 0, 'Nothing is booked on this date');
            assert.equal(bookings[7], 2, 'This is "2" since listing booking "2" is on this date');
            assert.equal(bookings[8], 2, 'This is "2" since listing booking "2" is on this date');
        });
    });
});
