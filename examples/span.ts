import { TextParser } from "../src/index";

interface ColorInstance {
  index: number;
  color: string;
}

const colorMap = [
  "#ffffff", // white (default)
  "#ff6969", // red
  "#65ff89", // green
  "#ffe430", // purple
  "#808080", // gray
  "#ff8932", // orange (small font)
]

const parser = new TextParser<[ColorInstance[]]>();
parser.registerCommand("c", true, (color, index, colors) => {
  colors.push({ index, color });
});

export function parse(input: string) {
  const colors: ColorInstance[] = [];
  const parsed = parser.parse(input, colors);
  
  let result = "";
  let pos = 0;
  let inside = false;
  for (const cmd of colors) {
    result += parsed.substring(pos, cmd.index);
    if (inside)
      result += "</span>";
    if (cmd.color !== "0") {
      result += `<span style="color: ${colorMap[cmd.color]}">`
      inside = true;
    } else {
      if (inside)
        inside = false;
    }
    pos = cmd.index;
  }
  if (inside)
    result += "</span>"
  result += parsed.substring(pos);

  return result;
}  
