// ==UserScript==
// @name google_groups_shortcuts
// @namespace darrinholst.com
// @description adds keyboard shortcuts to google groups
// @include http://groups.google.com*
// @include https://groups.google.com*
// ==/UserScript==

(function() {
  var HIGHLIGHT_CLASS = 'darrinholst_com_highlighted';
  var HELP_PANEL_ID = 'darrinholst_com_helppanel';
   
  var jQueryLoaded = (function() {
    var GROUP_LIST   = "group_list";
    var GROUP_ITEMS  = "group_item";
  	var commands = {};
  	var pageItems = null;
  	var itemIndex = -1;
  	
  	var items = [
      {type: GROUP_LIST,  selector: '#GHP_exp_my_groups_list b a',                                    parentToHighlight: 3},
      {type: GROUP_LIST,  selector: '#GHP_exp_my_groups_act tr td a',                                 parentToHighlight: 3},
      {type: GROUP_ITEMS, selector: 'div.maincontoutboxatt > table > tbody > tr > td > a[target=""]', parentToHighlight: 2},
      {type: GROUP_ITEMS, selector: '#moduleRecentDiscussionsModule1 a',                              parentToHighlight: 0}
  	]

    var clone = function(donor) {
      var o = {};

      for(i in donor) {
        o[i] = donor[i];
      }

      return o;
    }

  	var findAndSetPageItems = function() {
  	  var nodes = null;

  	  for(var i = 0, j = items.length; i < j; ++i) {
  	    nodes = $(items[i].selector);

  	    if(nodes.length > 0) {
  	      pageItems = clone(items[i]);
  	      pageItems.nodes = nodes;
  	      break;
  	    }
  	  }
  	  
  	  if(pageItems && pageItems.type === GROUP_LIST) {
  	    setItemIndexFor(GROUP_ITEMS, -1);
  	  }
  	}
  	
  	var highlightItem = function(index) {
  	  if(pageItems && index >= 0) {
    	  var itemToHighlight = $(pageItems.nodes[index]);
    	  
    	  for(var i = 0, j = pageItems.parentToHighlight; i < j; ++i) {
          itemToHighlight = itemToHighlight.parent();  	    
    	  }
    	  
    	  $('.' + HIGHLIGHT_CLASS).toggleClass(HIGHLIGHT_CLASS);
        itemToHighlight.toggleClass(HIGHLIGHT_CLASS);
      }
  	}
  	
  	var getItemIndex = function() {
  	  return GM_getValue(pageItems.type + 'index', -1);
  	}
  	
  	var setItemIndexFor = function(type, value) {
  	  GM_setValue(type + 'index', value);
  	}
    		  	
  	var setItemIndex = function(value) {
  	  setItemIndexFor(pageItems.type, value);
  	}
  	
  	var getHelpPanel = function() {
  	  var div = $('#' + HELP_PANEL_ID);
  	  
  	  if(div.length) {
  	    return div;
  	  }
  	    	  
  	  div = document.createElement('div');
  	  div.id = HELP_PANEL_ID;
  	  
  	  window.document.body.appendChild(div);
  	  
  	  div = $(div);
  	  div.append('<table>' + 
  	            '<tr><td>KEY</td><td>FUNCTION</td></tr>' +
  	            '<tr><td>n</td><td>next item</td></tr>' +
  	            '<tr><td>p</td><td>previous item</td></tr>' +
  	            '<tr><td>o</td><td>open item</td></tr>' +
  	            '<tr><td>h</td><td>display/hide help</td></tr>' +
  	            '</table>'
	    );
	    
  	  return div;
  	}
  	
  	// ~~G~~ main page
  	commands[71] = function() {
  	  window.location.pathname = "/"
  	}
  	
  	// ~~H~~ help
  	commands[72] = function() {
  	  getHelpPanel().show(); 
  	}
  	
  	// ~~N~~ highlight next item
  	commands[78] = function() {
  	  if(pageItems) {
  	    var index = getItemIndex() + 1;
  	    
  	    if(index >= pageItems.nodes.length) {
  	      index = pageItems.nodes.length - 1;
	      }
	      
	      setItemIndex(index);
        highlightItem(index)  	    
  	  }
  	}
  	
  	// ~~O~~ open highlighted item
  	commands[79] = function() {
  	  var index = getItemIndex();
  	  
  	  if(index >= 0) {
  	    window.location = pageItems.nodes[index].href;
  	  }  
  	}

  	// ~~P~~ highlight previous item
  	commands[80] = function() {
  	  if(pageItems) {
  	    var index = getItemIndex() - 1;
  	    
  	    if(index < 0) {
  	      index = 0;
	      }

	      setItemIndex(index);
        highlightItem(index);
  	  }  
  	}
  	
  	var keyHandler = function(event) {
  	  GM_log(event.keyCode)
  	  
      if (event.altKey || event.ctrlKey || event.metaKey || event.keyCode == 16) {
	      return false;
      }
      
  	  if (event.target && event.target.nodeName) {
        var targetNodeName = event.target.nodeName.toLowerCase();
  
        if (targetNodeName == "textarea" || (targetNodeName == "input" && event.target.type && event.target.type.toLowerCase() == "text")) {
          return true;
        }
      }
  	 
  	  var handler = commands[event.keyCode];
  	  
  	  if(handler) {
  	    if(event.keyCode == 72 && getHelpPanel().css('display') != 'none') {
  	      getHelpPanel().hide();
  	    }
  	    else {
  	      getHelpPanel().hide();
    	    handler.call(this);	      
  	    }
  	    
  	    return true;
  	  }
  
  	  return true; 	  
  	}
  	
  	return function() {   
	    window.addEventListener('keydown', keyHandler, false);    	
    	$('input[type="text"]').blur();
    	findAndSetPageItems();
    	highlightItem(getItemIndex());
	  }
  })();
  
  var loadCss = function() {
    var css = document.createElement('style');
    css.type = 'text/css';
    css.innerHTML  = '.' + HIGHLIGHT_CLASS + ' { background-color: #ff7; } '
    css.innerHTML += '#' + HELP_PANEL_ID + ' {display: none; position: absolute; width: 400px; height: 200px; top: 50%; left: 50%; margin-top: -100px; margin-left: -200px; background-color: #000; opacity: .9; font-size: 1.2em; font-family: Helvetica; color: white; font-weight: bold; }'
    css.innerHTML += '#' + HELP_PANEL_ID + ' table td {margin: 0; padding: 3px; padding-right: 10px;}'
    document.getElementsByTagName('head')[0].appendChild(css);    
  }
  
  var waitForjQueryToBeLoaded = function() {  
    if(typeof unsafeWindow.jQuery == 'undefined') { 
      window.setTimeout(waitForjQueryToBeLoaded,100); 
    }  
    else { 
      $ = unsafeWindow.jQuery; 
      jQueryLoaded(); 
    }  
  } 
  
  var loadjQuery = function() {
    var js = document.createElement('script');  
    js.type = 'text/javascript';  
    js.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js';  
    document.getElementsByTagName('head')[0].appendChild(js);
    waitForjQueryToBeLoaded();
  }
   
  loadCss();
  loadjQuery();
})();