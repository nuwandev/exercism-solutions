const gifts = [
  "a Partridge in a Pear Tree.",
  "two Turtle Doves,",
  "three French Hens,",
  "four Calling Birds,",
  "five Gold Rings,",
  "six Geese-a-Laying,",
  "seven Swans-a-Swimming,",
  "eight Maids-a-Milking,",
  "nine Ladies Dancing,",
  "ten Lords-a-Leaping,",
  "eleven Pipers Piping,",
  "twelve Drummers Drumming,"
];
const dayNames: string[] = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
  'tenth',
  'eleventh',
  'twelfth'
];

export function recite(start: number, end: number) {
  let lyrics: string[] = [];
  for (let i = 0; i < dayNames.length; i++) {
    let lyric = `On the ${dayNames[i]} day of Christmas my true love gave to me: `;
    let giftPart: string[] = [];
    for (let j = 0; j <= i; j++) {
      giftPart = [gifts[j], ...giftPart];
      if (j !== 0  && j === i) {
        giftPart[giftPart.length - 1] = 'and '+ giftPart[giftPart.length - 1]
      }
    }
    lyrics.push(lyric + giftPart.join(' '));
  }

  return lyrics.slice(start-1,end).join('\n') + '\n';
}
