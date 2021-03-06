var base_component = require('./base_component'),
    util = require('util'),
    logger = require('log4node');

function BaseFilter() {
  base_component.BaseComponent.call(this);
}

util.inherits(BaseFilter, base_component.BaseComponent);

BaseFilter.prototype.init = function(url) {
  logger.info('Initializing filter', this.config.name);

  this.loadConfig(url, function(err) {
    if (err) {
      this.emit('init_error', err);
      return;
    }
    this.on('input', function(data) {
      if (this.processMessage(data)) {
        var res = this.process(data);
        if (res) {
          if (res.length === undefined) {
            res = [res];
          }
          for(var i = 0; i < res.length; i ++) {
            this.emit('output', res[i]);
          }
        }
      }
      else {
        this.emit('output', data);
      }
    }.bind(this));

    this.emit('init_ok');
  }.bind(this));
}

BaseFilter.prototype.close = function(callback) {
  callback();
}

exports.BaseFilter = BaseFilter;
