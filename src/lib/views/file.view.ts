export class FileView {
  destination: string;
  name: string;
  path: string;

  constructor(destination: string, name: string) {
    this.destination = destination;
    this.name = name;
    this.path = 'http://localhost:8000/api/v1/uploads/' + name;
  }
}
