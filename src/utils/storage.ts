export const saveVal = (name: string, value: string) => {
  window.localStorage.setItem(name, value);
};

export const getVal = (name: string) => {
  return window.localStorage.getItem(name);
};
