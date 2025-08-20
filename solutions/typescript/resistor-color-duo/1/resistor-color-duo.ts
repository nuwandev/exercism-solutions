export function decodedValue(inputColors: string[]) {
  const colors = ['black','brown','red','orange','yellow','green','blue','violet','grey','white']
  return (colors.indexOf(inputColors[0]) * 10) + colors.indexOf(inputColors[1]);
}
