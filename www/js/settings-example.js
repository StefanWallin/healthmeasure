document.ngapp.value("settings", { 
	"app": {
		"menu_active": {
			"measure": true,
			"weigh": false,
			"exercise": false,
			"report": true,
			"settings": true,
			"feedback": false
		},
		"available_languages": ["en","sv"],
		"default_language": 0 // this array position refers to the available_languages array.
	},
	"dropbox": {
		"app_key": "xxxxxxxx",
		"app_secret": "xxxxxxxx"
	}
});