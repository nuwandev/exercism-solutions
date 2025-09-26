export class Allergies {
  public static valuesList: Record<string, number> = {
    "eggs": 1,
    "peanuts": 2,
    "shellfish": 4,
    "strawberries": 8,
    "tomatoes": 16,
    "chocolate": 32,
    "pollen": 64,
    "cats": 128,
  }

  private allergiesList: string[] = [];
  
  constructor(allergenIndex: number) {
    for (const [key, value] of Object.entries(Allergies.valuesList).reverse()) {
      if (allergenIndex & value) {
        this.allergiesList = [...this.allergiesList, key];
      }
    }
  }

  public list(): string[] {
    return this.allergiesList.reverse();
  }

  public allergicTo(allergen: string): boolean {
    return this.allergiesList.includes(allergen);
  }
}
