export const getLocalItem = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const setLocalItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
