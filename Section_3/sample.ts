// unknownの使い方
let a: unknown = 30 // unknownは明示的な型アノテーションが必要
let b = a === 123   // unknown型の値と他の値を比較することができる
let c = a + 10      // unknown型が特定の型であると想定した事柄は行えない↓

if (typeof a === 'number') {
  let d = a + 10    // 初めに、値が本当にその型であることをTypeScriptに示す必要がある
} 
  
let h = null
const g = [3]