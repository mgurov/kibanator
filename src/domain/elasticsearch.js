/**
 * 
 * @param {string} indexPrefix 
 * @param {Date} from
 * @param {Date} to, assumingly after from
 */
function selectIndexInterval(indexPrefix, from, to) {
    var cursor = new Date(to);
    var beginningOfTheFirstDay = new Date(from);
    beginningOfTheFirstDay.setHours(0,0,0,0);
    var result = [];
  
    while(cursor.getTime() > beginningOfTheFirstDay.getTime()) {
      var isoDate = cursor.toISOString().substr(0, 10).replace(/-/g, '.');
      result.push(indexPrefix + isoDate);
      cursor.setHours(cursor.getHours() - 24);
    }
    result.reverse();
    return result;
  }

export {selectIndexInterval};