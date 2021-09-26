## any

TypeScript では、コンパイル時にすべてのものが型を持っている必要がある

あるものの型が何であるか、プログラマーや TS がわからない場合のデフォルトの型が any

できるだけ避けるべき

## unknown

any と同様に任意の値を表すが、それが何であるかをチェックすることでそれを絞り込むまで、TypeScript は unknown 型の値の使用を許可しない

## boolean

リテラル型（ただ 1 つの値を表し、それ以外の値は受けいれない型）を作ることができる

`const c = true // このとき型はbooleanでなく、trueというリテラル型`

## number

リテラル型が使用可能

明示的に number と型づけする正当な理由はない

## bigint

丸めのエラーに遭遇することなく大きな整数を扱うことができる（2^53 以上の整数を表すことができる）

## string

可能な限り、TypeScript に型を推論させるべき

## symbol

オブジェクトやマップにおいて文字列キーの代わりとして、既知のキーが適切に使われ、うっかり誤った値が設定されていないことを強く確信したいような場合に用いられる

```
let a = Symbol('a')
let b:symbol = Symbol('b')
var c = a === b
let d = a + 'x' // '+'演算子を'symbol'型に適用することはできません
```

Symbol('a')によって、与えられた名前を持つ新しい symbol が作成される

その symbol は一意であり、他のどの symbol とも等しくならない

```
const e = Symbol('e')               // typeof e
const f:unique symbol = Symbol('f') // typeof f
let h = e === e                     // boolean
let i = e === f                     // エラー: 'unique symbol'と'unique symbol'は重複しないので、この条件は常にfalseを返します。
```

## オブジェクト

<b>構造的型づけ(structural typing)</b>

プログラミングのスタイルの一種

あるオブジェクトが特定のプロパティを持つことだけを重視し、その名前が何であるかは気にしない。

object という型は any とほぼ変わらない

明示的なアノテーションを除き、TypeScript に推論させることでオブジェクトを型付けする（オブジェクトリテラル表記）

```
let c: {
  firstName: string,
  lastName: string
} = {
  firstName: 'john',
  lastName: 'barrowman'
}

class Person {
  constructor(
    public firstName: string,
    public lastName: string
  ){}
}
c = new Person('matt', 'smith') // OK
```

デフォルトでは、オブジェクトのプロパティに関して非常に厳格

オブジェクトが number 型の b というプロパティを持つと記述した場合、TypeScript は b を、そして b だけを期待する。

b が欠けていたり、余分なプロパティがあると TypeScript はエラーを出す。

あるものがオプションであることや、予定よりも多くのプロパティが存在する可能性があることを TypeScript に伝えるには、以下のようにする。

```
let a: {
  b: number              // aはnumberであるプロパティbを持つ
  c?: string             // cはstringであるプロパティcを持つ可能性がある
  [key: number]: boolean // aは、booleanである数値プロパティを任意の数だけ持つことができる
}
```

以上のように設定すると、以下のような値が代入できる

```
a = {b:1}
a = {b:1, c:undefined}
a = {b:1, c:'d'}
a = {b:1, 10:true}
a = {b:1, 10:true, 20: false}
```

`[key: T]: U`という構文は「インデックスシグネチャ」と呼ばれる

インデックスシグネチャのキーの型（T）は、number か string のどちらかでなければならない

key という部分は任意の言葉に変更可能

---

オブジェクトはミュータブルのため、const を使っても中のプロパティは変更可能になってしまう

しかし、`readonly`をつけることで初期値から変更できないことを宣言することもできる

```
let user: {
  readonly firstName: string
} = {
  firstName: 'abby'
}

user.firstName = 'abbey with an e' // エラー
```

{}や Object 型は基本的に避けるべき（挙動が扱いづらい）

## 型エイリアス、合併、交差

#### 型エイリアス

変数宣言を使って値の別名となる変数を宣言できるのと同様に、ある型を指し示す型エイリアスを宣言することができる

```
type Age = number
type Person = {
  name: string
  age: Age
}
```

型エイリアスは TypeScript によって推論されないため、明示的に型付けする必要がある

#### 合併型と交差型

A と B という二つのものがある場合、合併とはそれらの和を指し、交差とはそれらが共通して持つものをさす

合併を表現する`|`と、交差を表現する`&`を使う

```
type Cat = {name: string, purrs: boolean}
type Dog = {name: string, barks: boolean, wags: boolean}
type CatOrDogOrBoth = Cat | Dog // nameを持っているが、purrs, barks, wagsは持っているとは限らない
type CatAndDog = Cat & Dog      // nameを持っており、purrs, barks, wagsすべてを持っている
```

## 配列

配列のすべての要素が同じ型を持つようにプログラムを設計するべき

たとえば、初期値として string と number が混在している(string | number)[]型が定義されたとき

その配列全体をマッピングし、すべての文字列を大文字に変換し、すべての数値を 3 倍にしたいと仮定すると

```
d.map(_ => {
  if (typeof _ === 'number'){
    return _ * 3
  }
  return _.toUpperCase()
})
```

としなければならなくなってしまう

## タプル

タプルは固定長の配列を型付けするための特別な方法

その配列の各インデックスでの値は特定の既知の型を持つ

タプルを宣言するときには、明示的に型付けする必要がある

```
let a:[number] = [1]
let b:[string, string, number] = ['malcolm', 'gladwell', 1963]
```

オブジェクト型の場合と同様に`?`はオプションを意味する

```
let a:[number, number?][] [
  [3.75]
  [8.25, 7.70(ここがオプショナル)]
  [10.50]
]

// これは以下と同様
let b:([number] | [number, number])[] = [
  ...
]
```

可変長の要素もサポートしている

```
// 少なくとも一つの要素を持つ、文字列のリスト
let friends: [string, ...string[]] = ['Sara', 'Tali', 'Chloe', 'Claire']
// 不均一なリスト
let list: [number, boolean, ...string[]] = [1, false, 'a', 'b', 'c']
```

イミュータブルな配列を作りたい場合、`readonly`をつける

```
let as: readonly number[] = [1,2,3]  // readonly number[]
let three = as[2]                    // number
as[2] = 6                            // エラー 読み取りのみを許可しています
as.push(4)                           // エラー プロパティpushはreadonly number[]に存在しません
```

## null, undefined, void, never

undefined…あるものがまだ定義されていない

null…値が欠如している

void…明示的に何も返さない関数の戻り値の型（console.log など）

never…決して戻ることのない関数の型（例外をスローする関数、永久に実行される関数など）

## 列挙型 (enum)

ある型についてとりえる値を列挙する方法

```
enum Language {
  English = 0,
  Spanish = 1,
  Russian = 2
}
```

```
let myFirstLanguage = Language.Russian     // Language
let meSecondLanguage = Language['English'] // Language
```

enum は計算される値を使うこともでき、そのすべてを定義する必要はない

enum は文字列値を使うこともできるし、文字列値と数値を混ぜることもできる

```
enum Color {
  Red = '#c10000'
  Blue = '#007ac1'
  Pink = 0xc10000 // 16進
  White = 255     // 10進
}
```

TypeScript では利便性を考慮して値とキーのどちらを使っても enum にアクセスできるが、キーを使ってアクセスすると取得できないはずの値が取得できるようになってしまう

回避するためには enum を const にする

const enum は逆引き参照を許可しないため、通常の JS オブジェクトと似た振る舞いをする

enum は自動的に数値が割り当てられるため、期待通りに動かないときがある

それを避けるために、基本的に const enum は文字列値で修正する

```
const enum Flippable {
  Burger = 'Burger',
  Chair = 'Chair',
  Cup = 'Cup'
}

function flip(f: Flippable){
  return 'flippable'
}

flip(Flippable.Chair) // flippable
flip(12)              // エラー
flip(hat)             // エラー
```

列挙型の安全な使用には落とし穴が伴うため、列挙型の使用は控えることが推奨されている
