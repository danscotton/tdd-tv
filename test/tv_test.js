const sinon = require('sinon');
const { expect } = require('chai');

const PriceComparison = {
    withRetailers (retailers = []) {
        const _retailers = retailers;

        return {
            cheapestRetailerFor (item) {
                const matches = _retailers
                    .map(retailer => ({ retailer, price: retailer.getPrice(item) }));

                const { price } = matches
                    .reduce((result, match) => match.price < result.price ? match : result);

                return matches
                    .filter((match) => match.price === price )
                    .map((match) => match.retailer )
            }
        };
    }
};

describe('PriceComparison', () => {
    it('finds the retailer with the cheapest television', () => {
        const screenBargains = { getPrice: () => 199.99 };
        const acmeTv = { getPrice: () => 149.99 };
        const televizion = { getPrice: () => 249.99 };

        const comparison = PriceComparison.withRetailers([
            screenBargains, acmeTv, televizion
        ]);

        const retailer = comparison
            .cheapestRetailerFor({ make: 'LG', model: 'SH002' });

        expect(retailer).to.deep.equal([acmeTv]);
    });

    it('finds retailers with the cheapest television', () => {
        const acmeTv = { getPrice: () => 149.99 };
        const screenBargains = { getPrice: () => 149.99 };
        const televizion = { getPrice: () => 249.99 };

        const comparison = PriceComparison.withRetailers([
            screenBargains, acmeTv, televizion
        ]);

        const retailer = comparison
            .cheapestRetailerFor({ make: 'LG', model:  'SH002' });

        expect(retailer).to.have.deep.members([acmeTv, screenBargains]);
    });
});
