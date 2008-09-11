// ==UserScript==
// @name           google_ig_picasa_to_flickr
// @namespace      darrinholst.com
// @description    changes picasa link to flickr in iGoogle
// @include        http://www.google.com/ig/*
// ==/UserScript==

var snapshot = document.evaluate('.//a[contains(@href, "picasaweb.google.com")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
 
for(var i = 0, j = snapshot.snapshotLength; i < j; i++) {
  snapshot.snapshotItem(i).href="http://flickr.com"
}