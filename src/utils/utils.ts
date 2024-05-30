class CustomError extends Error {
  error: { message: string };

  constructor({ name, message }: { name: string; message: string }) {
    super(message);
    this.name = name;
    this.error = { message };
    this.stack = new Error().stack;
  }
}

function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export { generateRandomNumber, CustomError };
