jStorage({
	'name': 'dropbox',
	'appKey': "rzcy0rw19tbuzj3",
	'callback': function(storage, callStatus) {
		console.log("storage: ", JSON.stringify(storage));
		console.log("callStatus: ", JSON.stringify(callStatus));
	}
});
