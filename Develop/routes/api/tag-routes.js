const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');
const { update } = require('../../models/Tag');

// The `/api/tags` endpoint

// find all tags
// be sure to include its associated Product data
router.get('/', (req, res) => {
  Tag.findAll({
    include: [Product]
  }).then(function(data){
    res.json(data);
  });
});

// find a single tag by its `id`
// be sure to include its associated Product data
router.get('/:id', (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id
    },
    include: [Product]
  }).then(function(data){
    res.json(data);
  });
});

// create a new tag
router.post('/', (req, res) => {
  console.log(req.body);
  Tag.create(req.body).then(Tag => {
    res.json(Tag);
  });
});

// update a tag's name by its `id` value
router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id
    },
  }).then((tag) => {
    return Tag.findAll({ where: { tag: req.params.id} });
  }).then((tags) => {
    const tagsIds = tags.map(( { tag_id }) => tag_id);
    const newTags = res.body.tagsIds
    .map((tag_id) => {
      return {
        tag_id: req.params.id,
        tag_name
      };
    });
    const tagsToRemove = tags
      .filter(({ tag_id }) => !req.body.tag.includes(tag_id))
      .map(({ id }) => id);

    return Promise.all([
      Tag.destroy({ where: { id: tagsToRemove } }),
      Tag.bulkCreate(newTags),
    ]);
  }).then((updatedTags) => res.json(updatedTags))
  .catch((err) => {
    res.status(400).json(err);
  });
});

// delete on tag by its `id` value
router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id
    }
  }).then(Tag => {
    res.json(Tag);
  });
});

module.exports = router;
