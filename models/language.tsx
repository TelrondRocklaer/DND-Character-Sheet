export default class Language {
  id: number;
  name: string;
  description: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
  }

  equals(language: Language) {
    return this.id === language.id;
  }
}