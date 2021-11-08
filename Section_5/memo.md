# クラスとインタフェース

TypeScript は、クラスのプロパティとメソッドに対して、3 つのアクセス修飾子をサポートしている

1. `public`
   どこからでもアクセス可能
1. `protected`
   このクラスとサブクラスのインスタンスからアクセス可能
1. `private`
   このクラスのインスタンスからのみアクセス可能

`abstract`が指定されたクラスは**抽象クラス**と呼ばれ、抽象クラスを直接インスタンス化しようとすると TypeScript はエラーを出す

例:

```
abstract class Piece {
  constructor(
    // ...
  )
}
```

```
new Piece('White', 'E', 1) // エラー: 抽象クラスのインスタンスは作成できません
```

abstract キーワードはそのクラスを直接インスタンス化できないことを意味するが、そのクラスにメソッドを定義できないということではない

Piece は直接インスタンス化できないようにして、King や Queen など特定の種類のインスタンスのみを作成できるようにした

その Piece クラスは moveTo()メソッドと canMoveTo()抽象メソッドを持つ

抽象メソッドはサブクラスがそのメソッドの実装（canMoveTo()）を忘れていると、コンパイル時に型エラーとなる

### まとめ

- class キーワードを使ってクラスを宣言する extends キーワードを使って、それらを拡張する（サブクラス）
- クラスは、抽象クラスか具象クラスのどちらかになれる 抽象クラスは抽象メソッドや抽象プロパティを持つことができる
- メソッドには、private, protected, public のいずれかを指定できる
- クラスはインスタンスプロパティを持つことができる これらも private, protected, public を指定できる それらは、コンストラクターのパラメーターの中で、またはプロパティ初期化子として宣言することができる
- インスタンスプロパティを宣言する時に、それらを readonly と指定することができる

## super

子クラスが親クラスで定義されたメソッドをオーバーライドする場合、子クラスのインスタンスは super 呼び出しを行うことでそのメソッドの親クラスのバージョンを呼び出すことができる

例: `super.take()`

super を使ってアクセスできるのは親クラスのメソッドだけであり、プロパティにはアクセスできない

## 戻り値の型として this を使用する

ES6 のデータ構造 Set の簡易版 ↓

```
let set = new Set
set.add(1).add(2).add(3)
set.has(2) // true
set.has(4) // false
```

を作成する

```
class Set {
  has(value: number): boolean {
    // ...
  }
}
```

`add`を呼び出すと、Set のインスタンスが返される

```
class Set {
  has(value: number): boolean {
    // ...
  }
  add(value: number): Set {
    // ...
  }
}
```

しかし、Set のサブクラスを作ろうとするとこうなってしまう

```
class MutableSet extends Set {
  delete(value: number): boolean {
    // ...
  }
}
```

このとき、`Set`の`add`は`Set`を返す。サブクラスの`MutableSet`ではこれをオーバーライドする必要がある

```
class MutableSet extends Set {
  add(value: number): MutableSet {
    // ...
  }
  delete(value: number): boolean {
    // ...
  }
}
```

別のクラスを作成するたびにこの作業を行うことは大変だし、わざわざ親クラスを作成する意味がなくなってしまう

代わりに、戻り値の型のアノテーションとして`this`を使い、TypeScript に作業をさせることができる

```
class Set {
  has(value: number): boolean {
    // ...
  }
  add(value: number): this {
    // ...
  }
}
```

これは、連鎖的に呼び出される API を扱う場合にとても便利な機能

## インタフェース

インタフェースは型に名前を付けるための方法であり、これを使うことでインラインで型を定義する必要がなくなる

型エイリアスとインタフェースはほぼ同じことを行うための構文だが、小さな違いがいくつかある

### 共通するもの

**型エイリアス**

```
type Sushi = {
  calories: number
  salty: boolean
  tasty: boolean
}
```

**インタフェース**

```
interface Sushi {
  calories: number
  salty: boolean
  tasty: boolean
}
```

合併や交差など、type でできた拡張を同様にインタフェースでも行うことができる

### 違うところ

- 型エイリアスは右辺の任意の型を指定できる

型の式（`&`や`|`のような型演算子）を指定することができる

インタフェースの場合、右辺は形状でなければならない

```
type A = number
type B = A | string
```

↑ のような型エイリアスをインタフェースに書き直すことはできない

- インタフェースを拡張する場合、拡張元のインタフェースが拡張先のインタフェースに割り当て可能かどうかを確認する

`sample.ts`を参照

オブジェクト型の継承をモデル化する際は、インタフェースを使った方がエラーを見つける際に有益なときがある

- 同じスコープ内に同じ名前のインタフェースが複数存在する場合、それらは自動的にマージされる

同名の型エイリアスがある場合は、コンパイル時エラーになる

## 実装

クラスを宣言するときに`implements`キーワードを使うと、そのクラスが特定のインタフェースを満たしていることを表現できる

```
interface Animal {
  eat(food: string): void
  sleep(hours: string): void
}

class Cat implements Animal {
  eat(food: string){
    console.info('Ate some',food,'. Mmm!')
  }
  sleep(hours: number){
    console.info('Slept for',hours,'hours')
  }
}
```

インタフェースは複数適用することもできる

## クラスは構造的に型づけされる

他のすべての型と同様に、TypeScript はクラスを、その名前ではなく **構造によって** 比較する

同じ中身のものは同じ型と捉えられるので、こういったコードがあってもエラーは発生しない

```
class Zebra {
  trot(){
    // ...
  }
}

class Poodle {
  trot(){
    // ...
  }
}

function ambleAround(animal: Zebra){
  animal.trot()
}
let zebra = new Zebra
let poodle = new Poodle

ambleAround(zebra) // OK
ambleAround(poodle) // OK
```

## ポリモーフィズム

関数や型と同様に、クラスとインタフェースはジェネリック型パラメーターをサポートしている

```
class MyMap<K, V> { // クラススコープのジェネリック型をバインド K,VはMyMapすべてのインスタンスメソッドとインスタンスプロパティで利用可能
  constructor(initialKey: K, initialValue: V) { // constructorではジェネリック型を宣言できない
    // ...
  }
  get(key: K): V {
    // ...
  }
  set(key: K, value: V): void {
    // ...
  }
  merge<K1, V1>(map: MyMap<K1, V1>): MyMap<K | K1, V | V1> { // 独自のジェネリック(K1, V1)を宣言することもできる
    // ...
  }
  static of<K, V>(k: K, v: V): MyMap<K, V> { // 静的メソッドはクラスのジェネリックにはアクセスできない ここでのK,Vは独自の宣言
    // ...
  }
}
```

## ミックスイン

ミックスインとは、複数の振る舞いやプロパティを 1 つのクラスの中にミックスすることを可能にするパターンのこと

- 状態（インスタンスプロパティ）を持つことができる
- 具象メソッド（抽象メソッドでないもの）だけを提供できる
- コンストラクターを持つことができる コンストラクターはクラスがミックスされた順序と同じ順序で呼び出される

例: TypeScript クラスのデバッグライブラリーを設計する(EZDebug)

```
class User {
  // ...
}

User.debug() // 'User({"id": 3, "name": "Emma Gluzman"})' と評価される
```

このようなミックスイン`withEZDebug`は次のような実装でできる

```
type ClassConstructor = new(...args: any[]) => {} // ①

function withEZDebug<C extends ClassContructor>(Class: C){ // ②
  return class extends Class {   // ③
    constructor(...args: any[]) {  // ④
      super(...args)  // ⑤
    }
  }
}
```

①: ClassConstructor という型を宣言する. これは任意のコンストラクターを表す

コンストラクターがどのようなパラメーターの型を持つかわからないので、任意の型の任意の数の引数を取ると表現している

②: 型 C は少なくともクラスコンストラクターでなければならない.（extends 節を用いて強制）

戻り値の型は推論させる

③: ミックスインはコンストラクターを取りコンストラクターを返す関数なので、無名クラスのコンストラクターを返す

④: そのクラスコンストラクターは、少なくとも渡されるクラスがとる引数を取る必要がある

⑤: この無名クラスは別のクラスを拡張するので、すべてを正しく設定するために Class のコンストラクターも忘れずに呼び出す

.debug を呼び出すとクラスのコンストラクター名とインスタンスの値がログに出力されるようにする

```
type ClassConstructor<T> = new(...args: any[]) => T // ① ジェネリック型パラメーターを追加

function withEZDebug<C extends ClassContructor<{
  getDebugValue(): object // ②
}>>(Class: C){
  return class extends Class {
    debug() {
      let Name = this.contructor.name
      let value = this.getDebugValue()
      return Name + '(' + JSON.stringify(value) + ')'
    }
  }
}
```

②: withEZDebug に渡されるコンストラクターが少なくとも.getDebugValue メソッドを定義していることを強制する

具体的な例で実装結果を見るとこのようになる

```
class HardToDebugUser {
  constructor(
    private id: number,
    private firstName: string,
    private lastName: string
  ){}
  getDebugValue() {
    return {
      id: this.id,
      name: this.firstName + ' ' + this.lastName
    }
  }
}

let User = withEZDebug(HardToDebugUser)
let user = new User(3, 'Emma', 'Gluzman')
user.debug() // 'HardToDebugUser({"id": 3, "name": "Emma Gluzman"})' と評価される
```

## デコレーター

TypeScript の実験的な機能のひとつ

クラス クラスメソッド プロパティ メソッドパラメーターを使ってメタプログラミングを行うための簡潔な構文を提供する

```
@serializable
class APIPayload {
  getValue(): Payload {
    // ...
  }
}
```

それぞれの種類のデコレーターに対して、指定された名前を持つ関数がスコープ内に存在すること、およびその種類のデコレーターについて必要とされるシグネチャをその関数がもつことを要求する

たとえば、クラスをデコレートする場合はコンストラクターが存在することを要求する

あまり理解しきれなかった 深く掘り下げられていないので、公式ドキュメントを参照する

## final クラスをシミュレートする

final とは、クラスを拡張不可としたり、メソッドをオーバーライド不可と設定したりするために使われるキーワード

final クラスを TypeScript でシミュレートするには、プライベートコンストラクターを利用する

```
class MessageQueue {
  private constructor(private messages: string[]) {}
}
```

コンストラクターがプライベートなら、そのクラスを拡張したり new したりすることができなくなる

クラスの拡張不可はいいけど、インスタンス化はできるようにしたい

それを実現するには以下のようにする

```
class MessageQueue {
  private constructor(private messages: string[]) {}
  static create(messages: string[]) {
    return new MessageQueue(messages)
  }
}
```

MessageQueue.create をすることでインスタンスが作れる

## デザインパターン

### ファクトリーパターン

どのような具体的なオブジェクトを作成するべきかの決定を、そのオブジェクトを作成する特定のファクトリー（工場）に任せる

靴のファクトリーを作る。まず、Shoe という型と数種類の靴を定義する

```
type Shoe = {
  purpose: string
}

class BalletFlat implements Shoe {
  purpose = 'dancing'
}

class Boot implements Shoe {
  purpose = 'woodcutting'
}
```

靴のファクトリーを作成する

```
let Shoe = {
  create(type: 'balletFlat' | 'boot'): Shoe {
    switch(type){
      case: 'balletFlat': return new BalletFlat
      case: 'boot': return new Boot
    }
  }
}
```

これで `Shoe.create('boot')` をすると Boot のインスタンスが作成される

### ビルダーパターン

こういうやつ

```
new RequestBuilder()
  .setURL('/users')
  .setMethod('get')
  .///
```

以下のように実装する

```
class RequestBuilder {
  private url: string | null = null // nullで初期化
  private method: 'get' | 'post' | null = null
  setURL(url: string): this { // ユーザーが呼び出したRequestBuilderの特定のインスタンスを返す（this）
    this.url = url
    return this
  }
  setMethod(method: 'get' | 'post'): this {
    this.method = method
  }
  // ...
}
```

## 練習問題

1. クラスとインターフェースの違い

回答

クラスはコンストラクターを作成することができる

インターフェースはコンストラクターを作るための設計を指示している

**答え**

クラスは JS コードを生成するので、実行時の instanceof のチェックもサポートしている

クラスは、型と値の両方を定義するが、インターフェースは型だけを定義し、JS コードは生成せず、型レベルのメンバーだけを含むことができ、アクセス修飾子を含むことはできない。

2. protected と指定するとどうなるか
   private ではそのクラスのインスタンスのみが参照できる値になるが、protected はそのクラスのサブクラスのインスタンスも値を参照できる
