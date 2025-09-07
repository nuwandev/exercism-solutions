export function commands(num: number): string[] {
  let binary: string = "";
  while (num !== 0) {
    binary = Math.floor(num%2) + binary;
    num = Math.floor(num/2)
  }
  binary = binary.padStart(5, "0");
  
  let round = 1;
  let commandsList: string[] = [];
  for (let i = binary.length-1; i >= 0; i--) {
    if (binary.charAt(i) === '1' && round === 1) {
      commandsList = [...commandsList, 'wink']
    }else if (binary.charAt(i) === '1' && round === 2) {
      commandsList = [...commandsList, 'double blink']
    }else if (binary.charAt(i) === '1' && round === 3) {
      commandsList = [...commandsList, 'close your eyes']
    }else if (binary.charAt(i) === '1' && round === 4) {
      commandsList = [...commandsList, 'jump']
    }else if (binary.charAt(i) === '1' && round === 5) {
      commandsList = commandsList.reverse();
    }
    round++;
  }

  return commandsList;
}
