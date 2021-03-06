// ==UserScript==
// @name           twitter_auto_refresh
// @namespace      http://darrinholst.com
// @description    Auto update twitter.com
// @include        http://www.twitter.com/home
// @include        http://twitter.com/home
// ==/UserScript==

(function() {
    var REFRESH_RATE = 3 * 60 * 1000;
    
    var update = function() {
      unsafeWindow.jQuery.ajax({type: 'GET', url: document.location, 
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Accept', "text/html");
          xhr.setRequestHeader('X-Requested-With', null);
        },
      
        complete: function(xhr, status) {
          var timeline = xhr.responseText.match(/<table[^>]*timeline[^>]*>([\s\S]+?)<\/table>/)
          var table = document.createElement('table');
          table.innerHTML = timeline[1];
          var statuses = unsafeWindow.jQuery('tr', table);
          var newCount = 0;
          
          for(var i = statuses.length - 1; i >= 0; i--) {
            if(unsafeWindow.jQuery('#' + statuses[i].id).length == 0) {
              unsafeWindow.jQuery('#timeline_body').prepend(statuses[i]);
              newCount++;
            }
          }
          
          table = null;
          
          if(newCount > 0) {
            var title = document.title;
            var m = title.match(/(.*) \((\d+)\)/)
            
            if(m) {
              newCount += parseInt(m[2]);
              title = m[1];
            }
            
            document.title = title + ' (' + newCount + ')';
          }
        }
      });     
    }
    
    var keyHandler = function(event) {
      if(event.keyCode == 75) {
    	  if (event.target && event.target.nodeName) {
          var targetNodeName = event.target.nodeName.toLowerCase();
    
          if (targetNodeName == "textarea" || (targetNodeName == "input" && event.target.type && event.target.type.toLowerCase() == "text")) {
            return true;
          }
        }
        
        document.title = "Twitter";
        unsafeWindow.jQuery('tr.hentry').addClass("already-read").addClass("aready-read").removeClass('last-read');
      }
    }
    
    unsafeWindow.jQuery('.elections-promotion').hide();
    setInterval(update, REFRESH_RATE);
    window.addEventListener('keydown', keyHandler, false);
})();
