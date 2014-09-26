require('datejs');

module.exports = function formatDate(date) {
  return Date.parse(date).toString('dddd, MMMM d, yyyy');
};
