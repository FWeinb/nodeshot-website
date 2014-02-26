(function( exports, undefined ) {
  'use strict';

  var NodeShotBuilder = function (conf) {
    this.conf = $.extend({
      options: {
        url        : '',
        callback   : '',
        format     : 'png',
        width      : 800,
        height     : 600,
        delay      : 0,
        scrollbar  : false,
        fullpage   : false
      },
      apiUrl: 'http://api.nodeshot.it:8080/ajax/'
    }, conf);

    this.init();
  };

  // Initialization
  NodeShotBuilder.prototype.init = function () {
    var namespace = 'nodeshot-builder__';
    this.conf.nodes = {
      url        : $('.' + namespace + 'input--url'),
      delay      : $('.' + namespace + 'input--delay'),
      width      : $('.' + namespace + 'input--width'),
      image      : $('.' + namespace + 'screenshot'),
      submit     : $('.' + namespace + 'submit'),
      loader     : $('.' + namespace + 'loader'),
      height     : $('.' + namespace + 'input--height'),
      format     : $('.' + namespace + 'input--format'),
      message    : $('.' + namespace + 'message'),
      wrapper    : $('.' + namespace + 'conditional'),
      moreBtn    : $('.' + namespace + 'more-button'),
      callback   : $('.' + namespace + 'input--callback'),
      advanced   : $('.' + namespace + 'advanced-options'),
      fullpage   : $('.' + namespace + 'input--fullpage'),
      scrollbar  : $('.' + namespace + 'input--scrollbar')
    };

    this.bind();
    this.getOptions();
  };

  // Getting default options from server
  NodeShotBuilder.prototype.getOptions = function () {
    var _self = this,
        entryName = 'NodeShotBuilder::options',
        entry = exports.localStorage.getItem(entryName);

    if (entry !== null) {
      _self.applyOptions(entry);
    } else {
      $.get(this.conf.apiUrl + 'options', function (response) {
        if (typeof response !== "undefined") {
          _self.applyOptions(response);
          exports.localStorage.setItem(entryName, JSON.stringify(response));
        }
      });
    }
  };

  NodeShotBuilder.prototype.applyOptions = function (options) {
    options = typeof options === 'string' ? JSON.parse(options) : options;

    this.conf.options.delay = options.delay;
    this.conf.options.width = options.width;
    this.conf.options.height = options.height;
    this.conf.options.format = options.format;
    this.conf.options.scrollbar = options.scrollbar;
    this.conf.options.fullpage = options.fullpage;

    // Width
    this.conf.nodes.width.attr({
      'placeholder': options.width,
      'max': options.maxwidth
    });

    // Height
    this.conf.nodes.height.attr({
      'placeholder': options.height,
      'max': options.maxheight,
    });

    // Delay
    this.conf.nodes.delay.attr({
      'placeholder': options.delay,
      'max': options.maxdelay,
    });

    // Format
    this.conf.nodes.format.filter('#' + options.format).prop('checked', true);

    // Scrollbar
    this.conf.nodes.scrollbar.attr('checked', this.conf.options.scrollbar === true);

    // Fullscreen
    this.conf.nodes.fullpage.attr('checked', this.conf.options.fullpage === true);
  };

  // Binding event listeners
  NodeShotBuilder.prototype.bind = function () {
    var _self = this;

    // URL
    this.conf.nodes.url.on('keyup', function () {
      var $this = $(this),
          $else = _self.conf.nodes.wrapper,
          display = $this.val() === '' ? 'none' : 'block';

      $else.css('display', display);
    });

    // Advanced options button
    this.conf.nodes.moreBtn.on('click', function () {
      _self.conf.nodes.advanced.toggle();
    });

    // Submit button
    this.conf.nodes.submit.on('click', function (event) {
      event.preventDefault();
      _self.generate();
    });

    // Image loaded
    this.conf.nodes.image.on('load', function () {
      _self.conf.nodes.message.hide().html('');
      _self.conf.nodes.image.show();
      _self.conf.nodes.loader.hide();
    });

  };

  // Get values from fields to fill object
  NodeShotBuilder.prototype.getValues = function () {
    this.conf.options.url = this.conf.nodes.url.val();
    this.conf.options.width = this.conf.nodes.width.val() || this.conf.options.width;
    this.conf.options.delay = this.conf.nodes.delay.val() || this.conf.options.delay;
    this.conf.options.height = this.conf.nodes.height.val() || this.conf.options.height;
    this.conf.options.format = this.conf.nodes.format.filter(':checked').val();
    this.conf.options.callback = this.conf.nodes.callback.val();
    this.conf.options.fullpage = this.conf.nodes.fullpage.prop('checked');
    this.conf.options.scrollbar = this.conf.nodes.scrollbar.prop('checked');
  };

  // Generate screenshot
  NodeShotBuilder.prototype.generate = function () {
    this.getValues();

    // Hide imgae and message
    this.conf.nodes.image.hide();
    this.conf.nodes.message.hide();

    // Show loader
    this.conf.nodes.loader.css('display', 'block');

    // Generate URL
    var url = new exports.URLGenerator({
      param: this.conf.options,
      root: this.conf.apiUrl
    }).generate();

    // Request
    var request = $.get(url);

    // Success
    request.then(function(data){
      this.conf.nodes.image.attr('src', data.url);
    }.bind(this));

    // Fail
    request.fail(function(data){
      // Show reason
      this.conf.nodes.message.show().html(data.responseJSON.reason);
      // Hide the loader and the image
      this.conf.nodes.image.hide();
      this.conf.nodes.loader.hide();
    }.bind(this));

  };

  // URL Generator from object
  var URLGenerator = function (conf) {
    this.conf = $.extend({
      root  : '',
      param : {}
    }, conf || {});

    return this;
  };

  URLGenerator.prototype.generate = function () {
    var property, value,
        string = '';

    for (property in this.conf.param) {
      value = this.conf.param[property];
      if (value) {
        string += '&' + property + '=' + value;
      }
    }

    string = this.conf.root + '?' + string.slice(1);
    return string;
  };

  exports.NodeShotBuilder = NodeShotBuilder;
  exports.URLGenerator = URLGenerator;
}(window));


