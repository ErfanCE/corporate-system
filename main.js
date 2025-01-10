const isNewPhoneNumber = (original, modified) => {
  const res = modified.filter((item) => !original.includes(item));
  if (!!res.length) return true;
  return false;
};

// [3, 2, 1],  [1] => false
// [1] , [1, 2, 3] => true
test([3, 2, 1], [1]);
test([1], [1, 2, 3]);
