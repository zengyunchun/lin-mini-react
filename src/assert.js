/**
 * 
 * 断言错误
 */

function assert(val) {
    if (!Boolean(val)) {
      throw new Error('assertion failure')
    }
  }
  
  module.exports = assert
  