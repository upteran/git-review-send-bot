export const parseName = (name: string, id: string | number): string => {
  return `[${name}](tg://user?id=${id})`;
};

export const parseHtmlName = (name: string, id: string | number): string => {
  return `<a href="tg://user?id=${id}">${name}</a>`;
};
