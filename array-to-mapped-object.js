const objectWithoutProperties = (obj, keys) => {
  const target = {};
  Object.keys(obj).forEach(key => {
    if (keys.indexOf(key) === -1) {
      target[key] = obj[key];
    }
  });
  return target;
};

module.exports = key => arr => arr.reduce(
  (
    obj,
    item
  ) => {
    const keyValue = item[key];
    const otherAttrs = objectWithoutProperties(item, [key]);

    return Object.assign(
      {},
      obj,
      {
        [keyValue]: otherAttrs
      }
    );
  }
, {});
