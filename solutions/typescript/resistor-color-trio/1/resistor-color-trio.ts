export function decodedResistorValue(input: string[]) {
  const COLORS = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white'];
  const first2 = COLORS.indexOf(input[0]) * 10 + COLORS.indexOf(input[1]);
  let rest = "";
  for (let i = 0; i < COLORS.indexOf(input[2]); i++) {
    rest+= "0"
  }
  const resistant = Number(`${first2}${rest}`)
  if (resistant >= 1000 && resistant < 1000000) {
    return `${resistant/1000} kiloohms`; 
  }else if(resistant >= 1000000 && resistant < 1000000000){
    return `${resistant/1000000} megaohms`; 
  }else if(resistant >= 1000000000){
    return `${resistant/1000000000} gigaohms`; 
  }
  return `${resistant} ohms`;
}
