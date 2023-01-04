module.exports = function(app) {
  var my_controller = require('./controllers/controller');

  // todoList Routes
  app.route('/controller')
    .get(my_controller.get)
    .post(my_controller.store);


  app.route('/controller/:productId')
    .get(my_controller.detail)
    .put(my_controller.update)
    .delete(my_controller.delete);
};