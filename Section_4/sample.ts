// オプションパラメーターとデフォルトパラメーター
function log(message:string, userId?:string){
  let time = new Date().toLocaleDateString()
  console.log(time, message, userId || 'Not signed in')
}

log('Page loaded')
log('User signed in', 'da763be')

// デフォルトパラメーターを使って書き直すと↓
// userIdについていた?が消える
function log_2(message:string, userId = 'Not signed in'){
  // ...
}
