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
  blue: '#4991cc',
  green: '#5ac57d',
  orange: '#edab51',
  red: '#ff6b6b',
  pink: '#e477b9',
  yellow: '#ffcb00',
  purple: '#af78f4',
  raspberry: '#ff0060',
  rgba,
};

export default Colors;
