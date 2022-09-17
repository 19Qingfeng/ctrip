const readline = require('readline');

exports.clearConsole = (title) => {
  // TTY 黄精
  if (process.stdout.isTTY) {
    console.log(process.stdout.rows);
    // 保留原本终端内容
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    // 移动光标位置
    readline.cursorTo(process.stdout, 0, 0);
    // 清屏光标
    readline.clearScreenDown(process.stdout);
    if (title) {
      console.log(title);
    }
  }
};
