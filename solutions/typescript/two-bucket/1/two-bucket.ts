export class TwoBucket {
  private size1: number
  private size2: number
  private goal: number
  private start: 'one' | 'two'
  private _moves = 0
  private _goalBucket = ''
  private _otherBucket = 0

  constructor(b1: number, b2: number, goal: number, start: 'one' | 'two') {
    this.size1 = b1
    this.size2 = b2
    this.goal = goal
    this.start = start
  }

  moves(): number {
    if (this.goal > Math.max(this.size1, this.size2)) throw new Error()
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
    if (this.goal % gcd(this.size1, this.size2) !== 0) throw new Error()

    const simulate = (fromCap: number, toCap: number, fromName: 'one' | 'two') => {
      let from = 0, to = 0, moves = 0
      while (true) {
        if (from === 0) { from = fromCap; moves++ }
        else if (to === toCap) { to = 0; moves++ }
        else {
          const pour = Math.min(from, toCap - to)
          from -= pour; to += pour; moves++
        }
        if (from === this.goal || to === this.goal) {
          const goalBucket = from === this.goal ? fromName : fromName === 'one' ? 'two' : 'one'
          const other = from === this.goal ? to : from
          return { moves, goalBucket, other }
        }
      }
    }

    // Special direct goal cases
    if (this.start === 'one' && this.goal === this.size2) {
      this._moves = 2
      this._goalBucket = 'two'
      this._otherBucket = this.size1
      return this._moves
    }
    if (this.start === 'two' && this.goal === this.size1) {
      this._moves = 2
      this._goalBucket = 'one'
      this._otherBucket = this.size2
      return this._moves
    }

    let result
    if (this.start === 'one') result = simulate(this.size1, this.size2, 'one')
    else result = simulate(this.size2, this.size1, 'two')

    this._moves = result.moves
    this._goalBucket = result.goalBucket
    this._otherBucket = result.other
    return this._moves
  }

  get goalBucket() {
    return this._goalBucket
  }

  get otherBucket() {
    return this._otherBucket
  }
}
