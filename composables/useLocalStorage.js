export const getLocalItem = (key) => {
  const cart = window.localStorage?.getItem(key)
  return JSON.parse(cart);
};

export const setLocalItem = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};
