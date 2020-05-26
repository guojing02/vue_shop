export function deepClone(origin,target){
  var target = target || {}
  let tostr = Object.prototype.toString
  let arrstr = '[object Array]';
  for(let prop in origin){
    if (origin.hasOwnProperty(prop)) {
      if(typeof(origin[prop]) == 'object'){
        if(tostr.call(origin[prop]) == arrstr){
          target[prop] = []
        }else{ 
          target[prop] = {}
        }
        deepClone(origin[prop],target[prop]);
      }else{
        target[prop] = origin[prop]
      }
    }
  }
  return target
}