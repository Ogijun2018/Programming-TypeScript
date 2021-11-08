interface A {
  good(x: number): string
  bad(x: number): string
}

type B = A & {
  good(x: string | number): string
  bad(x: string): string
}