# 6 章 高度な型

## 型の間の関係

### サブタイプとスーパータイプ

**サブタイプ**: B が A のサブタイプであるとき、A が要求されるところではどこでも、B を安全に使うことができる

例: 配列はオブジェクトのサブタイプ / Animal を拡張する Bird クラスがある場合、Bird は Animal のサブタイプ

**スーパータイプ**: B が A のスーパータイプであるとき、B が要求されるところではどこでも、A を安全に使うことができる

例: Animal は Bird のスーパータイプ

### 変性

これから、以下のようなルールで記述する

- `A <: B` は、「A が型 B のサブタイプであるか、または B と同じ型である」ことを表す
- `A >: B` は、「A が型 B のスーパータイプであるか、または B と同じ型である」ことを表す

#### 形状と配列の変性

次のような型のペアを使って、ユーザーを表現する

```
type ExistingUser = {
  id: number
  name: string
}

type NewUser = {
  name: string
}
```

ここで、ユーザーを削除するコードを書くとする

```
function deleteUser(user: {id?: number, name: string}) {
  delete user.id
}
let existingUser: ExistingUser = {
  id: 123456,
  name: "Ima User"
}

deleteUser(existingUser)
```

ここで起きる問題は、existingUser を deleteUser に渡した後で、TypeScript はユーザーの id が削除されたことを知らないため、deleteUser(existingUser)を使って削除した後で existingUser.id を読み取ろうとすると、TypeScript は依然として existingUser.id の型が number であると考えること

ある形状が期待される場合、「プロパティの型 <: 期待される型」となるプロパティを持つ型は渡すことができるが、期待される型のスーパータイプであるプロパティの型を持つ形状は渡すことができない

### 型の拡大

ある変数を後で変更することを許可する方法で宣言する場合、その変数の型はそのリテラル値から、そのリテラルが属するベースの型へと拡大される

```
let a = 'x' // string
let b = 3   // number
var c = true // boolean
const d = {x: 3} // {x: number}

enum E {X,Y,Z}
let e = E.X  // E
```

イミュータブルな宣言についてはそうではない

```
const a = 'x' // 'x'
...
```

明示的型アノテーションを使うと、型が拡大されるのを防ぐことができる

null または undefined に初期化された変数は、any に拡大される

```
let a = null   // any
a = 3          // any
a = 'b'        // any
```

#### const アサーション

let において `as const` を加えることで、宣言と同時に型の拡大を抑えることができる

const アサーションは型の拡大を抑えるだけでなく、その型のメンバーを再起的に `readonly` と指定する

TypeScript にできるだけ狭く型を推論してもらいたい場合に、const アサーションを使う

#### 過剰プロパティチェック

```
type Options = {
  baseURL: string
  cacheSize?: number
  tier?: 'prod' | 'dev'
}

class API {
  constructor(private options: Options) {}
}

new API({
  baseURL: 'https://api.mysite.com',
  tier: 'prod'
})
```

ここでスペルミスをして、`tier` を `tierr` とした場合、以下のようなエラーが出る

```
型 '{ baseURL: string; tierr: string; }' の引数を型 'Options' のパラメーターに割り当てることはできません。
オブジェクトリテラルで指定できるのは既知のプロパティのみですが、'tierr'は型'Options'に存在しません。
書こうとしたのは'tier'ですか？
```

ただ、このとき TypeScript は期待された型 {baseURL: string, cacheSize?: number, tier?: 'prod' | 'dev'}であり、渡した型はこのサブタイプのはず

しかし、どういうわけか TypeScript はエラーを報告しなければならないことを知っていた

→ **過剰プロパティチェック**

「フレッシュ（新鮮）なオブジェクトリテラル型」とは、オブジェクトリテラルから TypeScript が推論する型である

そのオブジェクトリテラルが型アサーション（`as`）を使用しているか、変数に割り当てられている場合、フレッシュさは失われる

### 型の絞り込み

JavaScript が falsy の値: `null`, `undefined`, `NaN`, `0`, `-0`, `""`, `false`

```
type Width = {
  unit: Unit,
  value: number
}

function parseWidth(width: number | string | null | undefined): Width | null {
  // widthがnullまたはundefinedであれば、すぐに戻る
  if (width == null){
    // イコール二つでfalsyかを判断
    // ここでnull/undefinedが消え、widthは (number | string) に絞り込まれる
    return null
  }

  // widthがnumberであれば、ピクセルをデフォルトの単位とする
  if(typeof width === 'number') {
    // widthがnumberであることが確定する
    return {unit: 'px', value: width}
  }

  let unit = parseUnit(width)
  if(unit){
    return {unit, value: parseFloat(width)}
  }

  return null
}
```

TypeScript は JavaScript がどのように動作するかを深く理解しており，プログラマーと同じように型を絞り込むことができる．

if ブロックの中で typeof のチェックにより特定の型でなければならないことと，if ブロックの後では別の型になることを理解している．

## 完全性

**完全性**は，網羅チェックとも呼ばれすべてのケースをカバーしていることを型チェッカーが確認できるようにするもの．

例: 指定した曜日の次の曜日を返す関数

```
type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
type Day = Weekday | 'Sat' | 'Sun'

function getNextDay(w: Weekday): Day {
  switch(w){
    case: 'Mon' : return 'Tue'
  }
}
```

このとき，TypeScript は次のようなエラーを出す．

```
エラーTS2366: 関数に終了のreturnステートメントがなく，戻り値の型に'undefined'が含まれていません．
```

getNextDay()における型アノテートをすることで，その型のすべての値が処理されていないことから TypeScript は警告を出す．

これは switch 文だろうと if 文だろうとすべてのケースがカバーされているかを確かめてくれる．

## 高度なオブジェクト型

### オブジェクト型についての型演算子

合併と交差（|と&）以外にも形状を扱う型演算子がある．

#### ルックアップ型

ネストされた複雑な型があると仮定する．

```
type APIResponse = {
  user: {
    userId: string
    friendList: {
      count: number
      friends: {
        firstName: string
        lastName: string
      }[]
    }
  }
}
```

この応答を API から取得しそれを表示する

```
function getAPIResponse(): Promise<APIResponse> {
  // ...
}

function renderFriendList(friendList: unknown) {
  // ...
}

let response = await getAPIResponce()
renderFriendList(response.user.friendList)
```

friendList を新しく型定義すると，このように実装しなおせる．

```
type FriendList = {
  count: number
  friends: {
    firstName: string
    lastName: string
  }[]
}

type APIResponse = {
  user: {
    userId: string
    friendList: FriendList
  }
}
```

しかし，このようにするとそれぞれの型（FriendList と APIResponse）に対して名前を考える必要があるが，これは常に望むことではない．

代わりに，キーを指定して型を取得（ルックアップ）することができる．

`type FriendList = APIResponse['user']['friendList']`

キーを指定することで，任意の形状や任意の配列にアクセスできる．

たとえば，FriendList の個々の友人の型を取得するには，

`type Friend = FriendList['friends'][number(0とか1とか)]`

ルックアップ型は['']を使用することに注意．
