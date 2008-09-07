// ==UserScript==
// @name           show years
// @namespace      http://darrinholst.com
// @description    adds the age to gcal events ending with " - [year]"
// @include        http://www.google.com/calendar/*
// @include        https://www.google.com/calendar/*
// ==/UserScript==

Function.prototype.bind = function() {
    var __method = this;
    var __object = arguments[0];

    return function() {
        return __method.apply(__object, arguments);
    }
}

var __DLH__ = {
    FREQUENCY:       500,
    EVENT_CONTAINER: 'mainbody',
    DATE_CONTAINER:  'dateunderlay',
    EVENT_TAG:       'nobr',

    watchThePage: function() {
        this.oldHtml = document.getElementById(this.EVENT_CONTAINER).innerHTML;
        setInterval(this.addAgesIfPageHasChanged.bind(this), this.FREQUENCY);
    },

    addAgesIfPageHasChanged: function() {
        if( document.getElementById(this.EVENT_CONTAINER).innerHTML != this.oldHtml ) {
            this.addAges();
        }
    },

    addAges: function() {
        var events = document.getElementById(this.EVENT_CONTAINER).getElementsByTagName(this.EVENT_TAG);
        var year = /^.*(\d{4})$/.exec(document.getElementById(this.DATE_CONTAINER).innerHTML)[1];

        for(var i = 0; i < events.length; i++) {
            var e = events[i].innerHTML;
            var match = /^.* - ((?:19|20)\d\d)$$/.exec(e);

            if(match) {
                events[i].innerHTML = e + ' (' + (year - match[1]) + ')';
            }
        }

        this.watchThePage();
    }
}

__DLH__.watchThePage();