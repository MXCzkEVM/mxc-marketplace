
function hash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // 将 hash 转换为一个 32 位整数
  }
  return hash;
}

export function getColorFromH3Id(h3Id: any) {
  const h3Hash = hash(h3Id.toString());
  const r = (h3Hash & 0xFF0000) >> 16;
  const g = (h3Hash & 0x00FF00) >> 8;
  const b = h3Hash & 0x0000FF;
  return `rgb(${r},${g},${b})`;
}



export function randomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
