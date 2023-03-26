export const testString = `以下是一个简单的实现 lodash 库的 get 方法的 JavaScript 代码：
javascript
function get(object, path, defaultValue) {
  // 将路径字符串转换为数组
  const pathArray = Array.isArray(path) ? path : path.split('.');
  
  // 逐层遍历对象，获取目标值
  let result = object;
  for (const key of pathArray) {
    if (result == null) {
      break;
    }
    result = result[key];
  }
  
  // 如果没有获取到目标值，则返回默认值
  return result ?? defaultValue;
  let result = object;
  for (const key of pathArray) {
    if (result == null) {
      break;
    }
    result = result[key];
  }
  
  // 如果没有获取到目标值，则返回默认值
  return result ?? defaultValue;
  let result = object;
  for (const key of pathArray) {
    if (result == null) {
      break;
    }
    result = result[key];
  }
  
  // 如果没有获取到目标值，则返回默认值
  return result ?? defaultValue;
  let result = object;
  for (const key of pathArray) {
    if (result == null) {
      break;
    }
    result = result[key];
  }
  
  // 如果没有获取到目标值，则返回默认值
  return result ?? defaultValue;
}



const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c'); // 返回 1
get(obj, ['a', 'b', 'c']); // 返回 1
get(obj, 'x.y.z', 'default'); // 返回 'default'
`;
