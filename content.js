(function() {
	var adPlayer, adContainer;
	var mediaDisplay;
	var mask = document.createElement('div');
	var isMasked = false;
	var maskSetup = false;
	var puppyPicture = true;

	function log(message) {
		console.log('[SocialBlock]: ' + message);
	}

	function setMask() {
		if (!maskSetup) {
			mask.id = "SocialBlockMask";

			mediaDisplay = document.createElement('div');
			mediaDisplay.id = "NoHuluAdsShowName";
			mediaDisplay.innerHTML = '<img src="https://i.imgur.com/UPsXAZH.jpg" alt="DOG" align="middle" style="width: 100%; height: 100%;">';

			mask.appendChild(mediaDisplay);

			maskSetup = true;
		} updateMask();
	}

	function updateMask() {
		mask.style.width = adPlayer.offsetWidth + "px";
		mask.style.height = adPlayer.offsetHeight + "px";
		mask.style.top = adPlayer.offsetTop + "px";
		mask.style.left = adPlayer.offsetLeft + "px";
		mask.style.backgroundColor = '#00FF00';
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
		adContainer.parentElement.removeChild(mask)
		isMasked = false;
	}

	function scrollThroughMedia() {
		log("media switch " + puppyPicture);
		if (puppyPicture) {
			mediaDisplay.innerHTML = '<img src="https://i.imgur.com/0JTQytw.jpg" alt="DOG" align="middle" style="width: 100%; height: 100%;">';
			puppyPicture = false;
		} else {
			mediaDisplay.innerHTML = '<img src="https://i.imgur.com/UPsXAZH.jpg" alt="DOG" align="middle" style="width: 100%; height: 100%;">';
			puppyPicture = true;
		}
	}

	window.setInterval(function() {
		if (!adPlayer || !adContainer || !playerContainer) {
			adPlayer = document.getElementsByTagName('video')[1];
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
				} else {
					scrollThroughMedia();
				}
			}
		}
	}, 1000);
})()