const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// find all categories
// be sure to include its associated Products
router.get('/', (req, res) => {
  Category.findAll({
    include: [Product]
  }).then(function(data){
    res.json(data);
  });
});

// find one category by its `id` value
// be sure to include its associated Products
router.get('/:id', (req, res) => {
  Category.findOne({
    where: {
      id: req.params.id
    },
    include: [Product]
  }).then(function(data){
    res.json(data);
  });
});

// create a new category
router.post('/', (req, res) => {
  console.log(req.body);
  Category.create(req.body).then(Category => {
    res.json(Category);
  });
});

// update a category by its `id` value
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  }).then((category) => {
    return Category.findAll({ where: { category_id: req.params.id } });
  })
  .then((category) => {
    const categoryIds = category.map(({ category_id}) => category_id);
    const newCategoryIds = req.body.ids
      .filter((category_id) => !categoryIds.includes(category_id))
      .map((category_id) => {
        return {
          category_id: req.params.id,
          category_name
        };
      })
    const categoryToRemove = category
      .filter(({ category_id}) => !req.body.categoryIds.includes(category_id))
      .map(({ id }) => id);
    
    return Promise.all([
      Category.destroy({ where: { id: categoryToRemove } }),
      Category.bulkCreate(newCategoryIds),
    ]);
  })
  .then((updatedCategory) => res.json(updatedCategory))
  .catch((err) => {
    res.status(400).json(err);
  })
});

// delete a category by its `id` value
router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id
    }
  }).then(Category => {
    res.json(Category);
  });
});

module.exports = router;
