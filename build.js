// 引入文件操作模块
const fs = require("fs");

// 获取命令行参数
const MainFileName = process.argv.slice(2);

// 获取目录结构
const FileArrFun = require("./filePathArr");

const FileArr = FileArrFun(MainFileName);

// 创建文件夹通用方法
const BuildFolder = function(url, mode, callback) {
  mode = mode || 0755;
  callback = callback || function() {};
  function inner(cur) {
    if (!fs.existsSync(cur)) {
      fs.mkdirSync(cur, mode);
      console.log(`\x1b[32m${cur}  \x1b[36m创建成功`);
      callback();
    } else {
      console.log(`\x1b[31m${cur}创建失败`);
      console.log(`\x1b[33m当前路径已有文件名为${cur}的文件夹`);
    }
  }
  inner(url);
};

// 创建文件通用方法
const BuildFile = function(FileWithPath, context, callback) {
  context = context || "";
  fs.open(FileWithPath, "ax", function(e, fd) {
    if (e) throw e;
    fs.write(fd, context, function(e) {
      if (e) throw e;
      console.log(`\x1b[32m${FileWithPath}  \x1b[36m创建成功`);
      fs.closeSync(fd);
      callback();
    });
  });
};

// 顺序创建文件目录
const BulidCatalog = function(index) {
  index = index ? index : 0;
  if (index < FileArr.length) {
    const isFile = FileArr[index].path.match(/\.[^(\/)]*$/) ? true : false;
    const path = FileArr[index].path;
    const data = FileArr[index].data || "";
    if (isFile) {
      // 创建文件
      BuildFile(path, data, () => {
        BulidCatalog(index + 1);
      });
    } else {
      // 创建项目文件夹
      BuildFolder(path, 0, () => {
        BulidCatalog(index + 1);
      });
    }
  } else {
    console.log("\x1b[36m-------项目目录创建成功--------");
  }
};

BulidCatalog();
