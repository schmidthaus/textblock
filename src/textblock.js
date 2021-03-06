var Textblock = function(textblocks) {
  onDocReady(function(){
    run();
    onResize(run);
  });
  function run(){
    each(textblocks, function(rawBlock){
      // loop through all the provided textblocks

      var block = prepBlockSettings(rawBlock);

      each(findEls(block.target), function(el){
        // loop through each element that matches the textblock's selector

        var measurements = calc(el, block);
        if (measurements) {
          el.style.fontSize = measurements.fontSize + block.units;
          el.style.lineHeight = measurements.lineHeight;
          el.style.fontVariationSettings = measurements.fontVariationSettings;
        }
      })
    });
  }
  function calc(el, block) {
    // returns object with calculated fontSize and lineHeight for an element.
    if (el) {
      var tb_minw = block.minWidth;
      var tb_maxw = block.maxWidth;
      var tb_minf = block.minFontSize;
      var tb_maxf = block.maxFontSize;
      var tb_minl = block.minLineHeight;
      var tb_maxl = block.maxLineHeight;
      var tb_cont = block.container;
      var tb_ming = block.minVariableGrade;
      var tb_maxg = block.maxVariableGrade;

      switch(tb_cont) {
        case 'self':
          var msr_width = elWidth(el);
          break;
        default:
          var msr_width = elWidth(el.parentNode);
      }

      var minld   = tb_minw / tb_minl;
      var maxld   = tb_maxw / tb_maxl;

      var fontsizevariation = tb_minf + ((tb_maxf - tb_minf) / (tb_maxw - tb_minw)) * (msr_width - tb_minw);
      var calctypesize = fontsizevariation;

      var leadingvariation = minld + ((maxld - minld) / (tb_maxw - tb_minw)) * (msr_width - tb_minw);
      var calcleading  = msr_width / leadingvariation;

      var gradevariation = tb_ming + ((tb_maxg - tb_ming) / (tb_maxw - tb_minw)) * (msr_width - tb_minw);
      var gradeMath = Math.max(Math.min(gradevariation, tb_ming), tb_maxg);
      var variableGradeSettings = '"wght" ' + gradeMath;

      return {
        fontSize: Math.min(Math.max(calctypesize, tb_minf), tb_maxf),
        lineHeight: Math.max(Math.min(calcleading, tb_minl), tb_maxl),
        fontVariationSettings: variableGradeSettings
      }
    }
  }
  function prepBlockSettings(block){
    var defaultSettings = {
      minWidth: 320,
      maxWidth: 960,
      minFontSize: 1.0,
      maxFontSize: 1.8,
      minLineHeight: 1.33,
      maxLineHeight: 1.25,
      container: 'parent',
      units: 'em'
    }
    return  Object.assign(defaultSettings, block);
  }
  function onDocReady(callback){
    // Listener for DOM ready. Replaces $(document).ready
    function modernBrowser(){
      if (
          document.readyState === "complete" ||
          (document.readyState !== "loading" && !document.documentElement.doScroll)
      ) {
        callback && callback();
      } else {
        document.addEventListener("DOMContentLoaded", function(){
          callback && callback();
        });
      }
    }
    function oldIE(){
      document.attachEvent("onreadystatechange", function(){
        if(document.readyState === "complete"){
          document.detachEvent("onreadystatechange", arguments.callee);
          callback && callback();
        }
      });
    }
    if (document.addEventListener) {
      modernBrowser();
    } else if (document.attachEvent) {
      oldIE();
    }
  }
  function onResize(callback){
    // listener for window resize
    if(window.attachEvent) {
      window.attachEvent('onresize', function() {
        callback && callback();
      });
    }
    else if(window.addEventListener) {
      window.addEventListener('resize', function() {
        callback && callback();
      }, true);
    }
  }
  function each(items, callback) {
    // loops through elements of an array
    for (var i = 0; i < items.length; i++) {
      callback && callback(items[i], i);
    }
  }
  function findEls(selector){
    // replaces jquery finder: $('.some-el')
    return document.querySelectorAll(selector);
  }
  function elWidth(el) {
    // calculates width, without padding and border width
    var width = el.offsetWidth;
    var paddingWidth = parseInt(elStyleVal(el, 'padding-left')) + parseInt(elStyleVal(el, 'padding-right'));
    var borderWidth =  parseInt(elStyleVal(el, 'border-left-width')) + parseInt(elStyleVal(el, 'border-right-width'))
    return el.offsetWidth - paddingWidth - borderWidth;
  }
  function elStyleVal(el, styleName) {
    // gets final calculated style values for element. For example, getting the final width or padding in px.
    if (window.getComputedStyle) {
      return window.getComputedStyle(el, null).getPropertyValue(styleName)
    } else {
      return el.currentStyle[styleName];
    }
  }
}
