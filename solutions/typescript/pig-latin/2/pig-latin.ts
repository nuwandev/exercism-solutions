export function translate(sentence: string) {
  return sentence.split(' ').map(w => {
    if (/^[^aeiou]+y/.test(w)) {
      const index = w.indexOf('y');
      return w.slice(index) + w.slice(0, index) + 'ay';
    }
    if (/^[^aeiou]*qu/.test(w)) {
      const index = w.indexOf('u') + 1;
      return w.slice(index) + w.slice(0, index) + 'ay'
    }
    if (/^(?:[aeiou]|xr|yt)/.test(w)) {
      return w + "ay"
    }
    const index = w.search(/[aeiou]/);
    if (index !== -1) {
      return w.slice(index) + w.slice(0, index)+ 'ay';
    }
  }).join(' ')
}
