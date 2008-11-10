// ==UserScript==
// @name           google_calendar_age_adder
// @namespace      http://darrinholst.com
// @description    Adds the age to gcal events ending with " - 9999" where 9999 is the start year of the event.
// @description    Great for birthday and anniversary events.This just modifies the html,it doesn't touch the actual event.
// @description    New settings allows to display only the age without the year. Just add [bd:YYYY] at the end
// @include        http://www.google.com/calendar/*
// @include        https://www.google.com/calendar/*
// ==/UserScript==

(function() {
	var EVENT_CONTAINER = 'mainbody',
			  DATE_CONTAINER = 'dateunderlay',
			  EVENT_TAG = 'a';

	document.getElementById(EVENT_CONTAINER).addEventListener('DOMSubtreeModified', function() {
		var events = document.getElementById(EVENT_CONTAINER).getElementsByTagName(EVENT_TAG);
		var year = /^.*(\d{4})$/.exec(document.getElementById(DATE_CONTAINER).innerHTML)[1];
		for (var i = 0; i < events.length; i++) {
			var e = events[i].innerHTML;

			// match old settings like xxxxx - YYYY
			var oldMatch = /^.* - ((?:19|20)\d\d)$$/.exec(e);

			// match new settings like xxxxx [bd:YYYY]
			var newMatch = /(^.* )(\[bd:(?:19|20)\d\d\])$$/.exec(e);

			if (oldMatch) {
				// shows: xxxxx - YYYY (age)
				events[i].innerHTML = e + ' (' + (year - oldMatch[1]) + ')';
			}

			if (newMatch) {
				// shows: xxxxx (age)
				var birthyear = newMatch[2].substring(4, 8);
				events[i].innerHTML = newMatch[1] + ' (' + (year - birthyear) + ')';
			}
		}
	}, true);
})();
