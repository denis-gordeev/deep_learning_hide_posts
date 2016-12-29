// ==UserScript==
// @name            Remove ad posts @VK
// @version         0.5.20161204.2
// @description	    removes ad posts from feed and walls by keywords
// @match           *://*.vk.com/*
// @copyright       2016, StSav012
// @author          StSav012
// @namespace       vkap
// @run-at          document-idle
// ==/UserScript==

var actualCode = '(' + function() {
	var keywords = [
		"Vision", "Amazon", "verge", "geekwire", "geektimes", "медик", "GPU", "Today's", "C++", "OpenAI", "deepmind.com", "Uber", "huffingtonpost", "technologyreview", "facebook", "wired", "tryolabs", "erogol", "hyperbaton", "Recent arxiv.org", "theantimedia", "Startup", "startup", "стартап", "cbinsights", "bloomberg", "Recent <a href=", "Das Magazin", "#yasubbotnik", "AMD", "Object Detection", "Cancer", "infoworld", "nextbigfuture", "nytimes", "CocoaHeads", "FindFace", "kpmg", "cancer", "HBO", "RGB", "healthcare", "рака", "biometrics"
	];
	var urls = [
		"/hackernoon","/habrahabr", "/techcrunch", "/infoworld", "/nextbigfuture", "/spectrum.ieee.org/", "/nplus1.ru/", "engadget.com"
	];
	var selectors = [
		"div.reply",
		"div._post, div.feed_row, div.wall_item"
	];
	var divs;	// selected tags list
	var n;		// length of the list
	var d;		// a DOM item
	var h, i, j, k;	// just iterators
	function cleanAd()
	{
		for(h = 0; h<selectors.length; ++h)
		{
			divs = document.querySelectorAll(selectors[h]);
			n = divs.length;
			for(i = 0; i<n; ++i)				// we check it from the very beginning and to the end
			{
				d = divs[i];
				if(d.getAttribute('no_ad') != 'true')	// from https://greasyfork.org/ru/scripts/1978-vk-com-no-politic-feed/code
				{					// does it worth checking the post?
					if(d.innerHTML.length>0)
					{
						for(j=0; j<keywords.length; ++j)
						{
							if(d.innerHTML.includes(keywords[j]))
							{
								//	d.parentNode.style.backgroundColor = "red"; // ← for debugging purposes
								d.parentNode.removeChild(d);
								break;
							}
						}
						for(k=0; (j>=keywords.length) && (k<urls.length); ++k)
						{
							if(!window.location.pathname.includes(urls[k]) && d.innerHTML.includes(urls[k]))
							{
								//	d.parentNode.style.backgroundColor = "red"; // ← for debugging purposes
								d.parentNode.removeChild(d);
								break;
							}
						}
						if((j>=keywords.length) && (k>=urls.length))
						{
							if(d.querySelector("span.wall_copy_more") === null)
								d.setAttribute('no_ad', 'true');
						}
					}
				}
			}
		}
	}
	cleanAd();
	// see http://stackoverflow.com/a/14570614
	var observeDOM = (function(){
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
			eventListenerSupported = window.addEventListener;

		return function(obj, callback){
			if( MutationObserver ){
				// define a new observer
				var obs = new MutationObserver(function(mutations, observer){
					if(mutations[0].addedNodes.length || mutations[0].removedNodes.length)
						callback();
				});
				// have the observer observe foo for changes in children
				obs.observe(obj, { childList:true, subtree:true });
			}
			else if( eventListenerSupported ){
				obj.addEventListener('DOMNodeInserted', callback, false);
				obj.addEventListener('DOMNodeRemoved', callback, false);
			}
		};
	})();
	var containers = document.querySelectorAll('body');
	n = containers.length;
	for(i = 0; i<n; ++i)
	{
		d = containers[i];
		observeDOM(d, cleanAd);
	}
} + ')();';
var script = document.createElement('script');
script.textContent = actualCode;
(document.body||document.documentElement).appendChild(script);
