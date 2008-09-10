// ==UserScript==
// @name           google_calendar_age_adder
// @namespace      http://darrinholst.com
// @description    Adds the age to gcal events ending with " - 9999" where 9999 is the start year of the event. Great for birthday and anniversary events. This just modifies the html, it doesn't touch the actual event.
// @include        http://www.google.com/calendar/*
// @include        https://www.google.com/calendar/*
// ==/UserScript==

(function() {
	var EVENT_CONTAINER = 'mainbody',
	    DATE_CONTAINER  = 'dateunderlay',
	    EVENT_TAG       = 'nobr';
	
	document.getElementById(EVENT_CONTAINER).addEventListener('DOMSubtreeModified', function() {
		var events = document.getElementById(EVENT_CONTAINER).getElementsByTagName(EVENT_TAG);
		var year = /^.*(\d{4})$/.exec(document.getElementById(DATE_CONTAINER).innerHTML)[1];

		for(var i = 0; i < events.length; i++) {
			var e = events[i].innerHTML;
			var match = /^.* - ((?:19|20)\d\d)$$/.exec(e);

			if(match) {
				events[i].innerHTML = e + ' (' + (year - match[1]) + ')';
			}
		}
	}, true);
})();
