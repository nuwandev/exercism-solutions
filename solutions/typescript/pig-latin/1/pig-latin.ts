export function translate(sentence: string) {
  return sentence.split(' ').map(w => {
    if (/^[^aeiou]+y/.test(w)) {
      const index = w.search('y');
      const before = w.slice(0, index);
      const after = w.slice(index);
      w = after + before;
    }
    
    if (/^[^aeiou]*qu/.test(w)) {
      const index = w.search('u') + 1;
      const before = w.slice(0, index);
      const after = w.slice(index);
      w = after + before;
    }
    
    const index = w.search(/[aeiou]/);
    if (index !== -1) {
      const before = w.slice(0, index);
      const after = w.slice(index);
      w = after + before;
    }

    if (/^[aeiou]|^xr|^yt|y/.test(w)) {
      w = w + "ay"
    }
    

    return w;
  }).join(' ')
}
