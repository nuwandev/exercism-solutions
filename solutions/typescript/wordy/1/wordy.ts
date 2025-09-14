export const answer = (quection: string) => {
  const regex = /^What is (.+)\?$/;
  const match = regex.exec(quection);
  
  if ('What is?' === quection) throw new Error('Syntax error') 
  if (!match) throw new Error("Unknown operation");
  
  const logic = match[1]; 

  if (/^-?\d+$/.test(logic)) {
    return Number(logic)
  } else if (/plus|minus|multiplied by|divided by/.test(logic)) {
    const tokenRegex = /-?\d+|plus|minus|multiplied by|divided by/g;
    const tokens = [...logic.matchAll(tokenRegex)].map(m => m[0]);

    if (tokens.length % 2 === 0) {throw new Error('Syntax error')}
    for (let i = 0; i < tokens.length; i++) {
      if (i%2==0 && isNaN(Number(tokens[i]))) {
        throw new Error('Syntax error');
      }else if (i%2==1 && !isNaN(Number(tokens[i]))){
        throw new Error('Syntax error');
      }
    }

    for (let i = 1; i < tokens.length - 1; i++) {
      if (i%2==1) console.log(tokens[i-1] + " --- " + tokens[i] + " ---- "+tokens[i+1])
      if (tokens[i] === 'plus') {
        tokens[i+1] = String(Number(tokens[i-1]) + Number(tokens[i+1]));
      }else if (tokens[i] === 'minus') {
        tokens[i+1] = String(Number(tokens[i-1]) - Number(tokens[i+1]));
      }else if (tokens[i] === 'divided by') {
        tokens[i+1] = String(Number(tokens[i-1]) / Number(tokens[i+1]));
      }else if (tokens[i] === 'multiplied by') {
        tokens[i+1] = String(Number(tokens[i-1]) * Number(tokens[i+1]));
      }
    }

    return Number(tokens[tokens.length-1]);
  }else {
    throw new Error("Unknown operation");
  }
}
