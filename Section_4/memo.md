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
