jStorage({
	'name': 'dropbox',
	'appKey': "rzcy0rw19tbuzj3",
	'callback': function(storage, callStatus) {
		if(callStatus.isOK) {
			localStorage.setItem("dropbox_authed", true);
			window.location.assign("https://xn--hlsomtt-5wan.se/#/settings/export");
		}
	}
});
