const axios = require('axios');

const config = (url, params = {}) => ({
  method: 'get',
  url,
  headers: { 'Content-Type': 'application/json' },
  params,
});

const fetchProducts = (req, res) => {
  const url = 'https://api.mercadolibre.com/sites/MLA/search';
  const params = {};

  if (req.query && req.query.q) {
    params.q = req.query.q;
  }

  axios(config(url, params))
    .then((results) => {
      const categories = [
        ...new Set(results.data.results.map((product) => product.category_id)),
      ];
      const items = results.data.results.map((product) => {
        const priceParsed = product.price.toString().split('.');

        return {
          id: product.id,
          title: product.title,
          price: {
            currency: product.currency_id,
            amount: priceParsed[0],
            decimals: priceParsed[1] || '',
          },
          picture: product.thumbnail,
          condition: product.condition,
          free_shipping: product.shipping.free_shipping,
        };
      });

      const ret = {
        author: {
          name: 'Azlain',
          lastname: 'Saavedra',
        },
        categories,
        items,
      };

      res.send(ret);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
};

const fetchProduct = (req, res) => {
  const urlProduct = `https://api.mercadolibre.com/items/${req.params.id}`;
  const urlProductDescription = `https://api.mercadolibre.com/items/${req.params.id}/description`;

  const reqProduct = axios(config(urlProduct));
  const reqProductDescription = axios(config(urlProductDescription));

  Promise.all([reqProduct, reqProductDescription])
    .then((results) => {
      const product = results[0].data;
      const productDescription = results[1].data;
      const priceParsed = product.price.toString().split('.');

      const ret = {
        author: {
          name: 'Azlain',
          lastname: 'Saavedra',
        },
        item: {
          id: product.id,
          title: product.title,
          price: {
            currency: product.currency_id,
            amount: priceParsed[0],
            decimals: priceParsed[1] || '',
          },
          picture: product.thumbnail,
          condition: product.condition,
          free_shipping: product.shipping.free_shipping,
          sold_quantity: product.sold_quantity,
          description: productDescription.plain_text,
        },
      };

      res.send(ret);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
};
module.exports = {
  fetchProducts,
  fetchProduct,
};
