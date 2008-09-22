// ==UserScript==
// @name           twitter_auto_refresh
// @namespace      http://darrinholst.com
// @description    Auto update twitter.com
// @include        http://www.twitter.com/home
// @include        http://twitter.com/home
// ==/UserScript==

(function() {
  var jQueryLoaded = (function() {
    var REFRESH_RATE = 3 * 60 * 1000;
    
    var update = function() {
      $.ajax({type: 'GET', url: document.location, 
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Accept', "text/html");
          xhr.setRequestHeader('X-Requested-With', null);
        },
      
        complete: function(xhr, status) {
          var timeline = xhr.responseText.match(/<table[^>]*timeline[^>]*>([\s\S]+?)<\/table>/)
          var table = document.createElement('table');
          table.innerHTML = timeline[1];
          var statuses = $('tr', table);
          
          for(var i = statuses.length - 1; i >= 0; i--) {
            if($('#' + statuses[i].id).length == 0) {
              $('#timeline').prepend(statuses[i]);
            }
          }
          
          table = null;
        }
      });     
    }	
    
  	return function() { 
      setInterval(update, REFRESH_RATE);
	  }
  })();
  
  var waitForjQueryToBeLoaded = function() {  
    if(typeof unsafeWindow.jQuery == 'undefined') { 
      window.setTimeout(waitForjQueryToBeLoaded, 100); 
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
   
  loadjQuery();
})();
