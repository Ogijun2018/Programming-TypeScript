## 関数の宣言と呼び出し

TypeScript は関数の本体全体を通じて常に型を推論するが、文脈から型を推論できる特別な場合を除いて、パラメーターについては型を推論しない（戻り値の型については推論する）

JS と TS は関数を宣言するための方法が 5 つある

1. 名前付き関数
1. 関数式
1. アロー関数式
1. アロー関数式の省略記法
1. 関数コンストラクター（Function 型となりパラメーターを渡し放題なので使うべきではない）

### オプションパラメーターとデフォルトパラメーター

オブジェクト型やタブル型と同様、`?`を使ってパラメーターを省略可能と指定することができる

宣言するとき、必須のパラメーターを先に指定し、省略可能なパラメーターはその後に指定する

デフォルトパラメーターを設定することでオプションパラメーターの`?`をなくすことができる（sample.ts 参照）

デフォルトパラメーターに明示的な型アノテーションを加えることもできる

```
type Context = {
  appId?: string,
  userId?: string
}

function log(message:string, context:Context={}){
  ...
}
```

### レストパラメーター

可変長引数の関数を安全に型付けする方法

```
function sumVariadicSafe(...numbers: number[]): number {
  retrun numbers.reduce((total, n) => total + n, 0)
}
sumVariadicSafe(1,2,3) // 6と評価される
```

`...`とつけると可変長引数を受けることができる

### call,apply,bind

```
function add(a:number, b:number): number {
  return a + b
}

add(10, 20)
add.apply(null, [10,20])
add.call(null, 10, 20)
add.bind(null, 10, 20)()   // すべて30と評価される
```

apply...値を関数内の`this`にバインドし（ここでは`null`を`this`に）、2 番目の引数を関数のパラメーターとして展開する

call...apply と同様だが、引数は順番に適用

bind...bind は関数を呼び出さない 代わりに新しい関数を返してくるため、`()`を使って関数を呼び出す そのとき、その時点ではまだバインドされていないパラメーターにバインドすべき追加の引数を渡すこともできる

### this の型付け

関数で`this`を使うときは期待する`this`の型を関数の最初のパラメーターとして宣言する（予約語）

```
function fancyDate(this: Date){
  return `${this.getMonth() + 1}/${...}
}

fancyDate.call(new Date) // 正常
fancyDate()              // エラー: 型Dateのメソッドのthisに割り当てることはできません
```

### ジェネレーター

```
function* createFibonacciGenerator() { // アスタリスク*でジェネレーター関数化 Generatorが返される
  let a = 0
  let b = 1
  while(true) {                        // 値を無限に生成することができる
    yield a;                           // ジェネレーターが返す値はyieldキーワードを使って生成
                                       // 利用者が次の値を要求するとyieldは結果を送り返し、次の値を要求するまで実行を休止する
    [a, b] = [b, a + b]                // aにbを、bにa+bを割り当てている
  }
}

let fibonacciGenerator = createFibonacciGenerator() // Generator<number>
fibonacciGenerator.next() // {value: 0, done: false}
fibonacciGenerator.next() // {value: 1, done: false}
fibonacciGenerator.next() // {value: 1, done: false}
fibonacciGenerator.next() // {value: 2, done: false}
```

TypeScript は yield によって生成される値の型から、ジェネレーターの型を推論できる

明示的にアノテートすることもできる

```
function* createNumbers(): Generator<number> {
  let n = 0
  while (1) {
    yield n++
  }
}
```

### イテレーター

ジェネレーターが一連の値を生成する方法であるのに対し、イテレーターはそれらの値を利用するための方法

イテレーターとは、next と呼ばれるメソッドを定義しているオブジェクト この next メソッドは、value/done というプロパティを持つオブジェクトを返す

例: 1 から 10 までの数値を返す反復可能オブジェクトを定義

```
let numbers = {
  *[Symbol.iterator]() {
    for (let n = 1; n <= 10; n++){
      yield n
    }
  }
}
```

ここもう少し詳しく調べる

### 呼び出しシグネチャ

```
function add(a:number, b:number): number {
  return a + b
}
```

このコードでは、型は Function になる

しかし、TypeScript では次のように表現できる

`(a:number, b:number) => number`

→ 関数の型についての TypeScript の構文、すなわち呼び出しシグネチャ（型シグネチャ）

この構文は、関数を引数として渡す場合や、関数を別の関数から返す場合に、それらを型付けするために使う

```
type Log = (message:string, userId?:string) => void

let log: Log = (
  message,                  // すでにLog型でmessageの型は指定されているのでここでは指定しなくてよい
  userId = 'Not signed in'  // 呼び出しシグネチャではデフォルト値は指定できないから
) => {
  let time = new Date.toISOString()
  console.log(time, message, userId)   // 戻り値の型も指定しなくてよい
}
```

### オーバーロードされた関数の型

```
// 呼び出しシグネチャの省略記法
type Log = (message:string, userId?:string) => void

// 完全な呼び出しシグネチャ
type Log = {
  (message:string, userId?:string): void
}
```

関数型のオーバーロードをするとき、完全な呼び出しシグネチャの記法の方が読みやすい時がある

オーバーロードされた関数とは、複数の呼び出しシグネチャを持つ関数のこと

オーバーロードされた関数のシグネチャを使うと、表現力のある API が設計できる（例: 旅行予約 API 日帰り旅行と通常の旅行をサポートする API は以下のようになる）

```
type Reserve = {
  (from: Date, to: Date, destination: string): Reservation
  (from: Date, destination: string): Reservation
}
```

この API を使用するために以下のようなコードを書くと、エラーが発生する

```
let reserve: Reserve = (from, to, destination) => {
  // エラー: 型'(from: any, to: any, destination: any) => void'を型'Reserve'に割り当てることはできません
}
```

こういった場合は、以下のように型の合併を使って書く必要がある

```
let reserve: Reserve = (
  from: date,
  toOrDestination: Date|string,
  destination?: string
) => {
  if (toOrDestination instanceof Date && destination !== undefined) {
    // 宿泊旅行を予約
  } else if (typeof toOrDestination === 'string') {
    // 日帰り旅行を予約する
  }
}
```

reserve は 2 つの方法のうちどちらかで呼び出されるので、reserve を実装する時にはそれがどのように呼び出されたかをチェック済みであることを TypeScript に示す必要がある

ブラウザーの DOM API の表現にはオーバーロードがよく使われている

例: `createElement`

それぞれのタグ用の型の新しい HTML 要素を返すので、TypeScript ではこうなっている

```
type CreateElement = {
  (tag: 'a'): HTMLAnchorElement
  (tag: 'canvas'): HTMLCanvasElement
  (tag: 'table'): HTMLTableElement
  (tag: 'string'): HTMLElement
}

let createElement: CreateElement = (tag: string): HTMLElement => {
  // ...
}
```

### ポリモーフィズム

たとえば、filter 関数を自作する時

```
function filter(array, f) {
  let result = []
  for (let i = 0; i < array.length, i++){
    let item = array[i]
    if(f(item)){
      retult.push(item)
    }
  }
  return result
}
```

これに対する型シグネチャはこうなる

```
type Filter = {
  (array: number[], f: (item: number) => boolean): number[]
}
```

このとき、配列が数値であれば問題ないが、filter 関数は数値以外にも文字列やオブジェクトにも対応したい

しかし、このままの実装だと機能しない → これを拡張しようと思ってオーバーロードしていっても、すべての型に対応することができない

ここで登場するのがジェネリック型である

ジェネリック型パラメーター T を使って書き直すと、filter の型は次のようになる

```
type Filter = {
  <T>(array: T[], f: (item: T) => boolean): T[]
}
```

<>（山括弧）を置くことでそのおいた場所によってジェネリックのスコープが決まり、TypeScript はそのスコープ内でジェネリック型パラメーターのすべてのインスタンスを最終的に同じ具体的な形にバインドする

#### ジェネリックはいつバインドされるか？

↑ の例では、<T>をシグネチャの一部として宣言したので、TypeScript は私たちが実際に Filter 型の関数を呼び出す時に具体的な型を T にバインドする

代わりに、型エイリアス Filter に T のスコープを設定したとすると、Filter を使用する時に型を明示的にバインドするように要求する

```
type Filter<T> = {
  (array: T[], f: (item: T) => boolean): T[]
}

let filter: Filter = (array, f) => {
  // エラー: ジェネリック型'Filter'には1個の型引数が必要です
}

type OtherFilter = Filter
  // エラー: ジェネリック型'Filter'には1個の型引数が必要です

let filter: Filter<number> = (array, f) => // OK

type StringFilter = Filter<string>
let stringFilter: StringFilter = (array, f) => {
  // OK
}
```

### ジェネリック型エイリアス

ジェネリック型エイリアス

```
type MyEvent<T> = {
  target: T
  type: string
}
```

この target プロパティは、イベントが発生した要素（<button />, <div />など）を指し示す

たとえば、ボタンのイベントを次のように表現できる

`type ButtonEvent = MyEvent<HTMLButtonElement>`

ジェネリック型を使用する場合は、その型を使うときに型パラメーターを明示的にバインドする必要があり、それらは推論されない

```
let myEvent: MyEvent<HTMLButtonElement | null> = {
  target: document.querySelector('#myButton'),
  type: 'click'
}
```

myEvent を使って別の型をつくることもできる

```
type TimedEvent<T> = { // TimedEventのTがバインドされるタイミングでMyEventのTもバインドされる
  event: MyEvent<T>
  from: Date
  to: Date
}
```

### 制限付きポリモーフィズム

#### 複数の制約をもつ制限付きポリモーフィズム

```
type HasSides = {numberOfSides: number}
type SidesHaveLength = {sideLength: number}

function logPerimeter<Shape extends HasSides & SidesHaveLength>(s: Shape): Shape {
  console.log(s.numberOfSides * s.sideLength)
  return s
}

type Square = HasSides & SidesHaveLength
let square: Square = {numberOfSides: 4, sideLength: 3}
logPerimeter(square) // "12"と出力される
```

1. logPerimeter は、型が Shape の 1 つの引数 s をとる関数
1. Shape は、HasSides 型と SidesHaveLength 型の両方を拡張するジェネリック型 Shape は少なくとも、HasSides 型と SidesHaveLength 型を両方持っていないとならない
1. logPerimeter は、渡された型とまったく同じ型の値を返す

#### 制限付きポリモーフィズムを使って 可変長引数をモデル化する

例: JavaScript の組み込み関数 `call` の独自バージョン（関数と任意のカスの引数を取り、それらの引数をその関数に適用する関数）

```
function call(f: (...args: unknown[]) => unknown, ...args: unknown): unknown {
  return f(...args)
}

function fill(length: number, value: string): string[] {
  return Array.from({length}, () => value)
}

call(fill, 10, 'a') // 10個の'a'からなる配列と評価される
```

- f は何らかの引数のセット T を取り、何らかの型 R を返す関数でなければならない
  - 何個の引数を持つかは事前にはわからない
- call は f の他に、f そのものが取るのと同じ引数のセット T をとる
  - 何個の引数を持つかは事前にはわからない
- call は f が返すのと同じ型 R を返す

これらを実現すると、以下のようなコードになる

```
function call<T extends unknown[], R>(f: (...args: T) => R, ...args: T): R{
  return f(...args)
}
```

### ジェネリック型のデフォルトの値

"ジェネリック型エイリアス"で出てきた MyEvent 型は以下のようなものだった

```
tyoe MyEvent<T> = {
  target: T
  type: string
}
```

T で明示的にバインドしないとならなかったが、デフォルトを設定するには以下のようにする

```
type MyEvent<T = HTMLElement> = {
  target: T
  type: string
}
```

T に制限を追加して、T が必ず HTML 要素であるようにすると

```
type MyEvent<T extends HTMLElement = HTMLElement> = {
  target: T
  type: string
}
```

関数のオプションパラメーターと同様に、デフォルトの型を持つジェネリック型は、デフォルトの型を持たないジェネリック型の後に指定する必要がある

## 練習問題

1. パラメーターと戻り値の型　その両方
   → 戻り値の型のみを推論する　「推論する」とはつまり、型名を書かなくてよいということ 戻り値のところに型はかかなくても動くが、パラメーターは基本的に型を書かなくてはならない

2. 型安全ではない
   → f(...args: unknown[])とする

3.

```
type Reserve = {
  (from: Date, to: Date, destination: string): Reservation
  (from: Date, destination: string): Reservation
  (destination: string): Reservation
}
```

```
let reserve: Reserve = (
  fromOrDestination: Date|string,
  toOrDestination: Date|string,
  destination?: string
) => {
  if (toOrDestination instanceof Date && destination !== undefined) {
    // 宿泊旅行を予約
  } else if (typeof fromOrDestination === 'string') {
    // すぐに出発する旅行を予約する
  } else if (typeof toOrDestination === 'string') {
    // 日帰り旅行を予約する
  }
}
```

4.

```
function call<T extends unknown[string, ...unknown], R>(f: (...args: T) => R, ...args: T): R{
  return f(...args)
}
```

5.  function is(asserted: unknown, asserting: unknown): unknown {
    return asserted === asserting
    }

function is<T>(asserted: T, asserting: T): boolean{
return asserted === asserting
}
