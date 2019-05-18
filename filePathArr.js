// 获取文件内容
const getFileData = require("./fileDataMap");

const getFilePathArr = function(MainName) {
  let fileArr = [
    "",
    "/index.tsx",
    `/${MainName}.ts`,
    "/activityFunction.ts",
    "/assets",
    "/comp",
    "/stores",
    "/stores/index.ts",
    "/views",
    "/views/router.tsx",
    "/views/main.tsx",
    "/views/styles",
    "/views/styles/main.style.ts"
  ];

  let resultArr = fileArr.map(item => {
    let resultObj = {
      path: `./${MainName}${item}`,
      data: getFileData(item, MainName)
    };
    return resultObj;
  });

  return resultArr;
};

module.exports = getFilePathArr;
