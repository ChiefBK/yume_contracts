const ListingManager = artifacts.require("ListingManager");

require('chai').use(require('chai-as-promised')).should();

contract('ListingManager', function([account1, account2, _account3]) {
	let listingManager;

	before(async () => {
		listingManager = await ListingManager.new();
	});

	it('has no listings', async () => {
		assert.equal(await listingManager.numOfListings(), 0);
		assert.equal(await listingManager.getListingRules(1), 0);
		assert.equal(await listingManager.getListingGuestInfo(1), 0);
	})

	describe('Contract Deployment', async () => {
		it('has a name', async () => {
			assert.equal(await listingManager.name(), 'Listing Manager');
		});
	});

	describe('#createListing', async () => {
		before(async () => {
			await listingManager.createListing(1, "test rules", "test guest info", { from: account1 });
		});

		it('has created one listing', async () => {
			const numOfListingsInContract = await listingManager.numOfListings();

			assert.equal(numOfListingsInContract, 1);
		});

		describe('Created Listing', async () => {
			it('has correct properties', async () => {
				const firstListingRules = await listingManager.getListingRules(1);
				const firstListingGuestInfo = await listingManager.getListingGuestInfo(1);
				const firstListingNumPrices = await listingManager.getListingNumPrices(1);
				const firstListingPropertyId = await listingManager.getListingPropertyId(1);
				const firstListingOwnerAddress = await listingManager.getListingOwner(1);

				assert.equal(firstListingRules, 'test rules');
				assert.equal(firstListingGuestInfo, 'test guest info')
				assert.equal(firstListingNumPrices, 0)
				assert.equal(firstListingPropertyId, 1)
				assert.equal(firstListingOwnerAddress, account1)

				// doesn't have prices (all are zero)
				await listingManager.getListingPriceAmount(1, 0).should.be.rejected;
				await listingManager.getListingPriceCurrency(1, 0).should.be.rejected;
				await listingManager.getListingPriceStartTime(1, 0).should.be.rejected;
				await listingManager.getListingPriceEndTime(1, 0).should.be.rejected;
			});
		})
	})

	describe('#appendPrice', async () => {
		before(async () => {
			await listingManager.createListing(1, "test rules", "test guest info", { from: account1 });
		});

		describe('listing', async () => {
			it('has a price with correct values', async () => {
				// $100 -- 0.058 ETH
				await listingManager.appendPrice(1, 10000, '0x555344', '58000000000000000', 1623283200, 1623542400);

				assert.equal(await listingManager.getListingPriceAmount(1, 0), 10000);
				assert.equal(await listingManager.getListingPriceCurrency(1, 0), '0x555344');
				assert.equal(await listingManager.getListingPriceStartTime(1, 0), 1623283200);
				assert.equal(await listingManager.getListingPriceEndTime(1, 0), 1623542400);
				assert.equal(await listingManager.getListingPriceWei(1, 0), '58000000000000000');
			})

			it('has incremented num of prices variable', async () => {
				assert.equal(await listingManager.getListingNumPrices(1), 1);
			})
		});

		describe('price begin or end times are not at midnight', async () => {
			it('rejects the tx', async () => {
				await listingManager.appendPrice(1, 10000, '0x555344', 1624247460, 1624593059).should.be.rejected;
			})
		});
	})

	describe('#editListing', async () => {
		before(async () => {
			await listingManager.createListing(1, "test rules", "test guest info", { from: account1 });
		});

		describe('edited listing', async () => {
			it('has new properties after edit', async () => {
				const originalRules = await listingManager.getListingRules(1);
				const originalGuestInfo = await listingManager.getListingGuestInfo(1);

				await listingManager.editListing(1, "a new set of rules", "some new guest info", { from: account1 });

				const updatedRules = await listingManager.getListingRules(1);
				const updatedGuestInfo = await listingManager.getListingGuestInfo(1);

				assert.notEqual(updatedRules, originalRules);
				assert.notEqual(updatedGuestInfo, originalGuestInfo);
			});

			it('is unchanged if non-owner tries to modify', async () => {
				const originalRules = await listingManager.getListingRules(1);
				const originalGuestInfo = await listingManager.getListingGuestInfo(1);

				await listingManager.editListing(1, "a new set of rules", "some new guest info", { from: account2 }).should.be.rejected;

				const updatedRules = await listingManager.getListingRules(1);
				const updatedGuestInfo = await listingManager.getListingGuestInfo(1);

				assert.equal(updatedRules, originalRules);
				assert.equal(updatedGuestInfo, originalGuestInfo);
			});
		});
	});

	describe('#determinePriceAmount', async () => {
		before(async () => {
			await listingManager.createListing(1, "test rules", "test guest info", { from: account1 });
			await listingManager.appendPrice(1, 10000, '0x555344', '58000000000000000', 1622505600, 1622592000); // June 1 to June 2
			await listingManager.appendPrice(1, 15000, '0x555344', '86000000000000000', 1622678400, 1622851200); // June 3 to June 5
			await listingManager.appendPrice(1, 11000, '0x555344', '63000000000000000', 1622937600, 1623024000); // June 6 to June 7
			await listingManager.appendPrice(1, 9000, '0x555344', '51000000000000000', 1623110400, 0); // June 8 onwards
		});

		it('computes the right price', async () => {
			// total price from June 1 to June 10
			assert.equal(await listingManager.determinePrice(1, 1622505600, 1623283200), '653000000000000000');
		})
	});
});
