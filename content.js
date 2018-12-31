(function() {
	var adPlayer, adContainer;
	var mediaContainer, mediaDisplay;
	var imageUrls;
	var mask = document.createElement('div');
	var isMasked = false;
	var maskSetup = false;
	var puppyPicture = true;
	var urlIndex = 0;
	var scrollInterval;

	var getJSON = function(url, callback) {
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', url, true);
	    xhr.responseType = 'json';
	    xhr.onload = function() {
	      var status = xhr.status;
	      if (status === 200) {
	        callback(null, xhr.response);
	      } else {
	        callback(status, xhr.response);
	      }
	    };
	    xhr.send();
	};

	function log(message) {
		console.log('[SocialBlock]: ' + message);
	}

	function setMask() {
		if (!maskSetup) {
			mask.id = "SocialBlockMask";

			mediaContainer = document.createElement('div');
			mediaContainer.id = "mediaContainer";
			mediaContainer.innerHTML = '';

			mediaDisplay = document.createElement('div');
			mediaDisplay.id = "NoHuluAdsShowName";
			mediaDisplay.innerHTML = '';

			mediaContainer.appendChild(mediaDisplay);
			mask.appendChild(mediaContainer);

			maskSetup = true;
		} updateMask();
		updateMediaContainer();
	}

	function updateMediaContainer() {
		mediaContainer.style.height = adPlayer.offsetHeight + "px";
		mediaDisplay.style.height = (adPlayer.offsetHeight - 64) + 'px';
		mediaContainer.style.padding = '2em';

	}

	function updateMask() {
		mask.style.width = adPlayer.offsetWidth + "px";
		mask.style.height = adPlayer.offsetHeight + "px";
		mask.style.top = adPlayer.offsetTop + "px";
		mask.style.left = adPlayer.offsetLeft + "px";
		mask.style.backgroundColor = '#696969';
		mask.style.zIndex = "2";
	}

	function maskVideo() {
		setMask();
		log('masking video');
		adContainer.parentElement.insertBefore(mask, playerContainer);
		isMasked = true;
	}

	function unmaskVideo() {
		log('unmasking video');
		stopScrolling();
		adContainer.parentElement.removeChild(mask)
		isMasked = false;
	}

	function getImageFeed() {
		imageUrls = [];
		var data = getJSON('http://www.reddit.com/r/all/.json?limit=50', function(err, data) {
			if (err !== null) {
				console.log('Something went wrong: ' + err);
			} else {
				for (var i = 0 ; i < data.data.children.length; i++) {
					var child = data.data.children[i];
					if (!child.data.is_video) {
						if (/^([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png))/i.test(child.data.url)) {
							imageUrls.push(child.data.url);
						}
					}
				}
				log(imageUrls.length);
				scrollThroughMedia();
			}
		});
	}

	function stopScrolling() {
		clearInterval(scrollInterval);
	}

	function scrollThroughMedia() {
		mediaDisplay.innerHTML = '<img src="' + imageUrls[urlIndex] + '" alt="image" align="middle" style="width: 100%; height: 100%; object-fit: contain;">';
		log("kappa123");
		scrollInterval = setInterval(function() {
			log('scrolling');
			if (!isMasked) {
				stopScrolling();
			}
			if (urlIndex < imageUrls.length) {
				urlIndex++;
			} else {
				urlIndex = 0;
			}
			log(imageUrls[urlIndex]);
			mediaDisplay.innerHTML = '<img src="' + imageUrls[urlIndex] + '" alt="image" align="middle" style="width: 100%; height: 100%; object-fit: contain;">';
		}, 10000);
	}

	window.setInterval(function() {
		if (!adPlayer || !adContainer || !playerContainer) {
			adPlayer = document.getElementsByTagName('video')[1];
			if (!adPlayer) {
				return;
			}
			adPlayer.muted = true;
			adContainer = document.getElementsByClassName('ad-container')[0];
			playerContainer = document.getElementsByClassName('player-container')[0];
			log('captured player elements');
		} else {
			if (!maskSetup) {
				setMask();
			}
			if (adContainer.style.display == 'none') {
				if (isMasked) {
					unmaskVideo();
				}
			} else {
				if (!isMasked) {
					maskVideo();
					getImageFeed();
				}
			}
		}
	}, 1000);
})()