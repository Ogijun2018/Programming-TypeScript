## コンパイラー

JavaScript

1. プログラムが AST（抽象構文木）へと解析される
2. AST がバイトコードにコンパイルされる
3. バイトコードがラインタイムによって評価される

TypeScript

1. TypeScript ソース → TypeScript AST
2. AST が型チェッカーによってチェックされる
3. TypeScript AST → JavaScript ソース
4. JavaScript ソースが AST（抽象構文木）へと解析される
5. AST がバイトコードにコンパイルされる
6. バイトコードがラインタイムによって評価される

一般に、明示的に型付けされたコードの使用を最小限に抑え、プログラマーの代わりに TypeScript にできるだけ多くの型を推論させるのは、良いスタイルと言える。

## tsconfig.json

どのファイルをコンパイルすべきか、コンパイル結果をどのディレクトリに格納するか、どのバージョンの JS を出力するかなどを定義する

`./node_modules/.bin/tsc --init` で生成可能

## tslint.json

作成するコードに対して望むスタイルの規約を定義する

`./node_modules/.bin/tslint --init` で生成可能
