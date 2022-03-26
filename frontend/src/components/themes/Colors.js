const rgba = (color, alpha) => {
  if (color.includes('#')) {
    const [r, g, b] = color.match(/\w\w/g).map((x) => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
  }
  if (!color.includes('rgba') && color.includes('rgb')) {
    const [r, g, b] = color.match(/\d+/g);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return color;
};

const Colors = {
  blue: '#3588cc',
  green: '#2abf5b',
  orange: '#eba342',
  red: '#f55353',
  pink: '#e368b3',
  yellow: '#f2c61b',
  purple: '#aa6df7',
  raspberry: '#ff0060',
  rgba,
};

export default Colors;
