// ==UserScript==
// @name           google_groups_topic_view
// @namespace      darrinholst.com
// @description    changes links to groups on groups.google.com to go directly to the topic view
// @include        http://groups.google.com*
// @include        https://groups.google.com*
// ==/UserScript==

var snapshot = document.evaluate('.//a[contains(@href, "/group/")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

for(var i = 0, j = snapshot.snapshotLength; i < j; i++) {
    var href = snapshot.snapshotItem(i).href;
    
    if(href.match(/\/group\/[a-zA-Z0-9-_]*$/)) {
        href = href + "/topics";
    }
    
  snapshot.snapshotItem(i).href = href;
}