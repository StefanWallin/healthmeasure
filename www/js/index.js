/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
	ngapp: null,
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', function(){}, false);
	}
};
var mainTemplate = 'partials/main.html';

document.ngapp = angular.module('healthmeasure', ['ngRoute', 'ngAnimate'])
.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'MainCtrl',
			templateUrl: mainTemplate
		})
		.when('/measure', {
			controller: 'MeasureCtrl',
			templateUrl: 'partials/measure.html'
		})
		.when('/weigh', {
			controller: 'WeighCtrl',
			templateUrl: 'partials/weigh.html'
		})
		.when('/exercise', {
			controller: 'ExerciseCtrl',
			templateUrl: 'partials/exercise_choose_group.html'
		})
		.when('/exercise/:group', {
			controller: 'ExerciseCtrl',
			templateUrl: 'partials/exercise_choose_activity.html'
		})
		.when('/exercise/:group/:activity', {
			controller: 'ExerciseCtrl',
			templateUrl: 'partials/exercise_entry.html'
		})
		.when('/report/', {
			controller: 'ReportCtrl',
			templateUrl: 'partials/report.html'
		})
		.when('/settings/', {
			controller: 'SettingsCtrl',
			templateUrl: 'partials/settings.html'
		})
		.when('/settings/language', {
			controller: 'LanguageSettingsCtrl',
			templateUrl: 'partials/settings_language.html'
		})
		.when('/settings/export', {
			controller: 'ExportCtrl',
			templateUrl: 'partials/settings_export.html'
		})
		.when('/settings/clear', {
			controller: 'ClearCtrl',
			templateUrl: 'partials/settings_clear.html'
		})
		.otherwise({
			redirectTo:'/'
		});
}).controller('MainCtrl', ['$scope', '$route', '$rootScope', 'translations', 'settings', 'backend', function($scope, $route, $rootScope, translations, settings, backend) {
	$rootScope.location = {
	baseUrl: $('base').attr('href')
	};

	$scope.translations = translations;
	$scope.settings = settings;
	$scope.currentLanguage = backend.getLanguage();
	$scope.setCurrentLanguage = function(language) {
		backend.setCurrentLanguage($scope, settings, language);
	};
	$scope.isOnMainPage = function() {
		if($route.current && $route.current.templateUrl === mainTemplate) {
			return true;
		}
		return false;
	};
	$scope.goBack = function() {
		history.back();
	};
}]).controller('MeasureCtrl', ['$scope', 'backend', '$location', '$timeout', 'translations', function($scope, backend, $location, $timeout, translations) {
	initJqueryBindings();
	var lastMeasurement = backend.getLastMeasurement();
	$scope.left_biceps = lastMeasurement.left_biceps;
	$scope.right_biceps = lastMeasurement.right_biceps;
	$scope.bust = lastMeasurement.bust;
	$scope.tummy = lastMeasurement.tummy;
	$scope.butt = lastMeasurement.butt;
	$scope.left_thigh = lastMeasurement.left_thigh;
	$scope.right_thigh = lastMeasurement.right_thigh;
	$scope.left_calf = lastMeasurement.left_calf;
	$scope.right_calf = lastMeasurement.right_calf;
	$scope.clicked = false;
	$scope.no_values_error = false;

	$scope.measureUp = function () {
		var dirty_but_empty = function (scope) {
			var returnValue = true;
			if(scope.new_left_biceps) returnValue = false;
			if(scope.new_right_biceps) returnValue = false;
			if(scope.new_bust) returnValue = false;
			if(scope.new_tummy) returnValue = false;
			if(scope.new_butt) returnValue = false;
			if(scope.new_left_thigh) returnValue = false;
			if(scope.new_right_thigh) returnValue = false;
			if(scope.new_left_calf) returnValue = false;
			if(scope.new_right_calf) returnValue = false;
			console.log(returnValue);
			return returnValue;
		};
		var date = new Date();

		if($scope.measureForm.$pristine || dirty_but_empty($scope)) {
			$scope.no_values_error = true;
			navigator.vibrate(3000);
			$timeout(function (argument) {
				$scope.no_values_error = false;
			}, 5000);
			return;
		}

		var data = {
			'date': date,
			'left_biceps': $scope.new_left_biceps || 0,
			'right_biceps': $scope.new_right_biceps || 0,
			'bust': $scope.new_bust || 0,
			'tummy': $scope.new_tummy || 0,
			'butt': $scope.new_butt || 0,
			'left_thigh': $scope.new_left_thigh || 0,
			'right_thigh': $scope.new_right_thigh || 0,
			'left_calf': $scope.new_left_calf || 0,
			'right_calf': $scope.new_right_calf || 0
		};
		backend.addMeasurement(data);
		var page = "report";

		$location.url(page);
	};
}]).controller('WeighCtrl', ['$scope', 'backend', '$location',  function($scope, backend, $location) {
	initJqueryBindings();
	var lastWeight = backend.getLastWeight();
	$scope.weight = lastWeight.weight;
	$scope.max_weight = parseFloat(lastWeight.weight) + 7;
	$scope.min_weight = parseFloat(lastWeight.weight) - 7;
	$scope.last_date = lastWeight.date;
	$scope.new_weight = lastWeight.weight;


	$scope.weighUp = function () {
		var date = new Date();

		var data = {
			'date': date,
			'weight': $scope.new_weight || 0
		};
		backend.addWeight(data);
		$scope.new_weight = 0;
		var page = "report";
		$location.url(page);
	};
}]).controller('ExerciseCtrl', ['$scope', '$routeParams', 'activityData', 'translations', function($scope, $routeParams, activityData, translations) {
	initJqueryBindings();
	$scope.activityData = activityData;
	$scope.params = $routeParams;
	
}]).controller('ReportCtrl', ['$scope', 'backend', 'graphdata', function($scope, backend, graphdata) {
	initJqueryBindings();
	$scope.measurementsData = backend.getMeasurements();
	$scope.shouldShowHeader = function(index) {
		if(index === 0 || moment($scope.measurementsData[index].date).isoWeek() != moment($scope.measurementsData[index-1].date).isoWeek()) {
			return true;
		} else {
			return false;
		}
	};
	$scope.average = function(one, two) {
		return Math.floor((parseInt(one, 10) + parseInt(two, 10))/2);
	};
	
}]).controller('SettingsCtrl', ['$scope', 'backend',function($scope, backend) {
	initJqueryBindings();
}]).controller('LanguageSettingsCtrl', ['$scope', 'backend', function($scope, backend) {

}]).controller('ExportCtrl', ['$scope', 'backend', function($scope, backend) {
	$scope.exportData = function() {
		console.error("function exportData not yet implemented.");
	};
}]).controller('ClearCtrl', ['$scope', 'backend', function($scope, backend) {
	$scope.clearData = function() {
		var response=confirm("Vill du verkligen ta bort all sparad data?");
		if (response === true) {
			backend.clearMeasurements();
			backend.clearWeights();
		}
	};

}]).filter('weekly', function() {
	return function(dateString) {
		return moment(dateString).isoWeek();
	};
}).filter('fromNow', function() {
	return function(dateString) {
		return moment(dateString).fromNow();
	};
}).filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };	
}).factory('graphdata', function(){
	var graphdata = {
		getTableData: function(array, x_key, y_key) {
			if(array === null || array.length === 0) {
				return [];
			}
			var result = {
				'x_name': "",
				'y_name': "",
				'x_min': 0,
				'x_max': 0,
				'y_min': 0,
				'y_max': 0,
				'values': []
			};
			result.x_min= array[0][x_key];
			result.x_max = array[0][x_key];
			result.y_min = array[0][y_key];
			result.y_max = array[0][y_key];
			for(var i = 0; i < array.length; i++) {
				var point = array[i];
				if(point[x_key] < result.x_min) {
					result.x_min = point[x_key];
				}
				if(point[x_key] > result.x_max){
					result.x_max = point[x_key];
				}
				if(point[y_key] < result.y_min) {
					result.y_min = point[y_key];
				}
				if(point[y_key] > result.y_max){
					result.y_max = point[y_key];
				}
				result.values.push({
					x: point[x_key],
					y: point[y_key]
				});
			}
			return result;
		}
	};
	return graphdata;
}).factory('backend', ['settings' , function(settings) {
	var m = null; // Measurments cache object
	var w = null; // Weights cache object
	var backend = {
		login: function () {},
		logout: function () {},


		// Internal API endpoints
		
		getMeasurements: function () {
			return this.getDataPoints("measurements");
		},
		getWeights: function () {
			return this.getDataPoints("weights");
		},


		getLastMeasurement: function () {
			if(m === null) {
				m = this.getMeasurements();
			}
			if(m.length > 0){
				return m[m.length-1];
			} else {
				return [];
			}
		},
		getLastWeight: function () {
			if(w === null) {
				w = this.getWeights();
			}
			if(w.length > 0){
				return w[w.length-1];
			} else {
				return [];
			}
		},


		addMeasurement: function (measurement) {
			m = this.addDataPoint(m, "measurements", measurement);
			return m;
		},
		addWeight: function (weight) {
			w = this.addDataPoint(w, "weights", weight);
			return w;
		},


		clearMeasurements: function () {
			m = [];
			this.clearDataPoints(m, "measurements");
		},
		clearWeights: function () {
			w = [];
			this.clearDataPoints(m, "weights");
		},


		// Core logic data storage functions
		
		getDataPoints: function (key) {
			d = localStorage.getItem(key);
			if(d === null || d === "") {
				d = [];
				d = JSON.stringify(d);
				localStorage.setItem(key, d);
			}
			d = JSON.parse(d);
			return d;
		},
		addDataPoint: function (d, key, dataPoint) {
			if(d === null) {
				d = [];
			}
			d.push(dataPoint);
			localStorage.setItem(key, JSON.stringify(d));
			return d;

		},
		clearDataPoints: function (d, key) {
			localStorage.setItem(key, JSON.stringify(d));
		},


		getLanguage: function () {
			var selectedLanguage = localStorage.getItem("selectedLanguage");
			if(selectedLanguage === null || selectedLanguage === "") {
				// TODO, make sure this works as properly.
				selectedLanguage = navigator.language.substr(0,2);
			}
			if(settings.app.available_languages.indexOf(selectedLanguage) == -1) {
				// Default case when selected language isn't available(when indexOf returns -1)
				selectedLanguage = settings.app.available_languages[settings.app.default_language];
			}
			return selectedLanguage;
		},
		setCurrentLanguage: function ($scope, settings, language) {
			// Checking if the selected language exists in the available language. indexOf returns '-1' if it doesn't.
			if(settings.app.available_languages.indexOf(language) != -1) {
				$scope.currentLanguage = language;
				localStorage.setItem("selectedLanguage", language);
			}
		}
	};
	return backend;
}]).directive('btn',function () {
	return {
		restrict: 'E',
		transclude: true,
		controller: function($scope, $timeout) {
			$scope.clicked = false;
			$scope.btnClick = function(){
				$scope.clicked = true;

				$timeout(function() {
					$scope.clicked = false;
				}, 350);
			};
		},
		scope: {
			action: "&ngClick",
			type: "@type"
		},
		template: "<button ng-click='[action(), btnClick()]' ng-transclude class='btn btn-fullwidth btn-{{type}}' ng-class='{btn_active: clicked}'></button>"
	};
});

function initJqueryBindings(){
	var onClass = "on";
	var showClass = "show";

	jQuery(".field--wrapper > input", document).bind("checkval",function(evt) {
		var $label = jQuery(this).prev("label");
		var target = evt.target;
		var $target = jQuery(target);
		if(target === document.activeElement){
			$label.addClass(showClass);
			$label.siblings("small").addClass(showClass);
			var text = $target.data("placeholder") || "";
			$target.attr("placeholder", text);
		} else {
			if(!$target.data("placeholder") && $target.hasClass(showClass)){
				$target.attr("placeholder","");
			} else {
				$target.attr("placeholder", $label.text());
			}
			$label.removeClass(showClass);
		}
	}).on("keyup",function(){
		jQuery(this).trigger("checkval");
	}).on("focus",function(){
		jQuery(this).prev("label").addClass(onClass);
		jQuery(this).trigger("checkval");
	}).on("blur",function(){
		jQuery(this).prev("label").removeClass(onClass);
	}).trigger("checkval");



}

document.addEventListener('deviceready', initJqueryBindings, false);


