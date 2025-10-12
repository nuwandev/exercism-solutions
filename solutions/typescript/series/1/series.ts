export class Series {
  private series: string;
  
  constructor(series: string) {
    this.series = series.trim()
  }

  slices(sliceLength: number): number[][] {
    const length = this.series.length;
    
    if (length === 0) {
      throw new Error('series cannot be empty')
    }
    
    if (sliceLength > length) {
      throw new Error('slice length cannot be greater than series length')
    }
    
    if (sliceLength === 0) {
      throw new Error('slice length cannot be zero')
    }
    
    if (sliceLength < 0) {
      throw new Error('slice length cannot be negative')
    }

    const slicedSeries = [];
    let startIndex = 0;
    for (let i = 0; i < length; i++) {
      const slice: number[] = [];
      for (let i = startIndex; i < startIndex + sliceLength; i++) {
        slice.push(parseInt(this.series.charAt(i)))
      }
      startIndex++;
      slicedSeries.push(slice);

      if (startIndex + sliceLength > length) {
        break;
      }
    }
    
    return slicedSeries;
  }
}
