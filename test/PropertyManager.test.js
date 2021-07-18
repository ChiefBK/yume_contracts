const PropertyManager = artifacts.require("PropertyManager");

require('chai').use(require('chai-as-promised')).should();

contract('PropertyManager', function([account1, account2, _account3]) {
	let propertyManager;

	before(async () => {
		propertyManager = await PropertyManager.new();
	});

	it('has no properties', async () => {
		assert.equal(await propertyManager.numOfProperties(), 0);
	})

	describe('Contract Deployment', async () => {
		it('has a name', async () => {
			assert.equal(await propertyManager.name(), 'Property Manager');
		});
	});

	describe('#createProperty', async () => {
		let city = 'Chicago',
			state = 'Illinois',
			bedrooms = 2,
			fullBaths = 1,
			halfBaths = 1,
			kingBeds = 1,
			queenBeds = 0,
			fullBeds = 2,
			twinBeds = 1,
			sqFootage = 2500,
			maxGuests = 8;

		before(async () => {
			await propertyManager.createProperty(
				city,
				state,
				bedrooms,
				fullBaths,
				halfBaths,
				kingBeds,
				queenBeds,
				fullBeds,
				twinBeds,
				sqFootage,
				maxGuests,
				{ from: account1 }
			);
		});

		it('has created one property', async () => {
			const numOfPropertiesInContract = await propertyManager.numOfProperties();
			assert.equal(numOfPropertiesInContract, 1);
		});

		describe('Created Property', async () => {
			it('has correct properties', async () => {
				assert.equal(await propertyManager.getPropertyCity(1), city);
				assert.equal(await propertyManager.getPropertyState(1), state);
				assert.equal(await propertyManager.getPropertyBedrooms(1), bedrooms);
				assert.equal(await propertyManager.getPropertyFullBaths(1), fullBaths);
				assert.equal(await propertyManager.getPropertyHalfBaths(1), halfBaths);
				assert.equal(await propertyManager.getPropertyKingBeds(1), kingBeds);
				assert.equal(await propertyManager.getPropertyQueenBeds(1), queenBeds);
				assert.equal(await propertyManager.getPropertyFullBeds(1), fullBeds);
				assert.equal(await propertyManager.getPropertyTwinBeds(1), twinBeds);
				assert.equal(await propertyManager.getPropertySqFootage(1), sqFootage);
				assert.equal(await propertyManager.getPropertyMaxGuests(1), maxGuests);
			});
		})
	})
});
