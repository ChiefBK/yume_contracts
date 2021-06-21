const ListingManager = artifacts.require("ListingManager");

require('chai').use(require('chai-as-promised')).should();

contract('ListingManger', ([account1, account2, account3]) => {
	let listingManager;

	before(async () => {
		listingManager = await ListingManager.new();
	});

	it('has no listings', async () => {
		assert.equal(await listingManager.numOfListings(), 0);
	})

	describe('Contract Deployment', async () => {
		it('has a name', async () => {
			assert.equal(await listingManager.name(), 'Listing Manager');
		});
	});

	describe('createListing', async () => {
		before(async () => {
			await listingManager.createListing(1, "test rules", "test guest info", { from: account1 });
		});

		it('has created one listing', async () => {
			const numOfListingsInContract = await listingManager.numOfListings();

			assert.equal(numOfListingsInContract, 1);
		});

		describe('Created Listing', async () => {
			it('has correct properties', async () => {
				const firstListingRules = await listingManager.getListingRules(0);
				const firstListingGuestInfo = await listingManager.getListingGuestInfo(0);
				const firstListingNumPrices = await listingManager.getListingNumPrices(0);
				const firstListingPropertyId = await listingManager.getListingPropertyId(0);
				const firstListingOwnerAddress = await listingManager.getListingOwner(0);

				assert.equal(firstListingRules, 'test rules');
				assert.equal(firstListingGuestInfo, 'test guest info')
				assert.equal(firstListingNumPrices, 0)
				assert.equal(firstListingPropertyId, 1)
				assert.equal(firstListingOwnerAddress, account1)

				// doesn't have prices (all are zero)
				assert.equal(await listingManager.getListingPriceAmount(0, 0), 0);
				assert.equal(await listingManager.getListingPriceCurrency(0, 0), 0);
				assert.equal(await listingManager.getListingPriceStartTime(0, 0), 0);
				assert.equal(await listingManager.getListingPriceEndTime(0, 0), 0);
			});
		})
	})

	describe('appendPrice', async () => {
		before(async () => {
			await listingManager.createListing(1, "test rules", "test guest info", { from: account1 });
			await listingManager.appendPrice(0, 10000, '0x555344', 1624247460, 1624593059);
		});

		describe('listing', async () => {
			it('has a price with correct values', async () => {
				assert.equal(await listingManager.getListingPriceAmount(0, 0), 10000);
				assert.equal(await listingManager.getListingPriceCurrency(0, 0), '0x555344');
				assert.equal(await listingManager.getListingPriceStartTime(0, 0), 1624247460);
				assert.equal(await listingManager.getListingPriceEndTime(0, 0), 1624593059);
			})

			it('has incremented num of prices variable', async () => {
				assert.equal(await listingManager.getListingNumPrices(0), 1);
			})
		})
	})

	describe('determinePrice', async () => {
		before(async () => {
			await listingManager.createListing(1, "test rules", "test guest info", { from: account1 });
			await listingManager.appendPrice(0, 10000, '0x555344', 1624247460, 1624593059);
		});

		describe('datetime specified falls within on the pricing windows', async () => {
			it('returns the index of the first price', async () => {
				const priceIndex = await listingManager.determinePrice(0, 1624247462)

				assert.equal(priceIndex, 0);
			})
		})

		describe('datetime specified outside the pricing windows', async () => {
			it('returns -1', async () => {
				const priceIndex = await listingManager.determinePrice(0, 1624247459)

				assert.equal(priceIndex, -1);
			})
		})
	})

	describe('editListing', async () => {
		before(async () => {
			await listingManager.createListing(1, "test rules", "test guest info", { from: account1 });
		});

		describe('edited listing', async () => {
			it('has new properties after edit', async () => {
				const originalRules = await listingManager.getListingRules(0);
				const originalGuestInfo = await listingManager.getListingGuestInfo(0);

				await listingManager.editListing(0, "a new set of rules", "some new guest info", { from: account1 });

				const updatedRules = await listingManager.getListingRules(0);
				const updatedGuestInfo = await listingManager.getListingGuestInfo(0);

				assert.notEqual(updatedRules, originalRules);
				assert.notEqual(updatedGuestInfo, originalGuestInfo);
			});

			it('is unchanged if non-owner tries to modify', async () => {
				const originalRules = await listingManager.getListingRules(0);
				const originalGuestInfo = await listingManager.getListingGuestInfo(0);

				await listingManager.editListing(0, "a new set of rules", "some new guest info", { from: account2 }).should.be.rejected;

				const updatedRules = await listingManager.getListingRules(0);
				const updatedGuestInfo = await listingManager.getListingGuestInfo(0);

				assert.equal(updatedRules, originalRules);
				assert.equal(updatedGuestInfo, originalGuestInfo);
			});
		});
	});


	// describe('Dapp Token Deployment', async () => {
	// 	it('has a name', async () => {

	// 		assert.equal(await dappToken.name(), 'DApp Token');
	// 	})
	// })

	// describe('Token Farm Deployment', async () => {
	// 	it('has a name', async () => {

	// 		assert.equal(await tokenFarm.name(), 'Dapp Token Farm');
	// 	})

	// 	it('contract has tokens', async () => {
	// 		const balance = await dappToken.balanceOf(tokenFarm.address);

	// 		assert.equal(balance.toString(), tokens('1000000'));
	// 	})
	// })

	// describe('Farming tokens', async () => {
	// 	it('rewards investors for staking mDai tokens', async () => {
	// 		let result;

	// 		result = await daiToken.balanceOf(investor)
	// 		assert.equal(result.toString(), tokens('100'));

	// 		await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });
	// 		await tokenFarm.stakeTokens(tokens('100'), { from: investor });

	// 		result = await daiToken.balanceOf(investor);
	// 		assert.equal(result.toString(), tokens('0'));

	// 		result = await daiToken.balanceOf(tokenFarm.address);
	// 		assert.equal(result.toString(), tokens('100'));

	// 		result = await tokenFarm.isStaking(investor)
	// 		assert.equal(result.toString(), 'true')

	// 		await tokenFarm.issueTokens({ from: owner })

	// 		let r = await dappToken.balanceOf(investor);
	// 		assert.equal(r.toString(), tokens('100'));

	// 		await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

	// 		//unstake tokens
	// 		await tokenFarm.unstakeTokens({from: investor})

	// 		r = await daiToken.balanceOf(investor)
	// 		assert.equal(r.toString(), tokens('100'))

	// 		r = await daiToken.balanceOf(tokenFarm.address)
	// 		assert.equal(r.toString(), tokens('0'))

	// 		r = await tokenFarm.stakingBalance(investor)
	// 		assert.equal(r.toString(), tokens('0'))

	// 		r = await tokenFarm.isStaking(investor)
	// 		assert.equal(r.toString(), 'false')
	// 	})
	// });
});