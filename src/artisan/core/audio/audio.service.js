/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	// todo !!!

	var options = {
		audio: {
			volume: 0.85,
			bands: 128, // 64 on mobile
		}
	};

	app.factory('AudioSound', ['$q', function($q) {

		window.AudioContext = window.AudioContext || window.webkitAudioContext;

		var ctx = new AudioContext();
		var buffers = {};

		function AudioSound($options) {
			var options = {
				volume: 0.85,
				loop: false,
			};
			if ($options) {
				angular.extend(options, $options);
			}
			var sound = this;
			sound.options = options;
			sound.offset = options.offset || 0;
			this.addAnalyserNode();
			this.addGainNode();
		}

		AudioSound.prototype = {
			nodes: {},
			addGainNode: function() {
				var sound = this;
				var node = ctx.createGain ? ctx.createGain() : ctx.createGainNode();
				node.connect(ctx.destination);
				node.gain.value = sound.options.volume;
				sound.nodes.gain = node;
			},
			addAnalyserNode: function() {
				var sound = this;
				if (sound.options.analyser) {
					var node = ctx.createAnalyser();
					node.fftSize = options.audio.bands * 2;
					sound.data = new Uint8Array(node.frequencyBinCount);
					sound.nodes.analyser = node;
				}
			},
			connectNodes: function() {
				var sound = this;
				var source = sound.source;
				for (var p in sound.nodes) {
					var node = sound.nodes[p];
					source.connect(node);
					if (p === 'gain') {
						node.connect(ctx.destination);
					}
				}
				// console.log('connectNodes', sound.nodes);
			},
			disconnect: function() {
				var sound = this;
				var source = sound.source;
				if (source) {
					for (var p in sound.nodes) {
						var node = sound.nodes[p];
						if (p === 'gain') {
							node.disconnect(ctx.destination);
						}
						source.disconnect(sound.nodes[p]);
						// console.log('AudioSound.disconnect', p);
					}
					// source.diconnect();
					sound.source = null;
				}
			},
			updateBuffer: function() {
				var deferred = $q.defer();
				var sound = this;
				var source = sound.source;
				sound.getBuffer().then(function(buffer) {
					if (source) {
						source.buffer = buffer;
					} else {
						source = ctx.createBufferSource();
						source.buffer = buffer;
						sound.source = source;
						sound.connectNodes();
					}
					deferred.resolve(source);
				}, function(error) {
					deferred.reject(error);
				});
				return deferred.promise;
			},
			getBuffer: function() {
				// console.log('AudioSound.getBuffer');
				var deferred = $q.defer();
				var sound = this;
				var path = sound.path;
				var buffer = buffers[path];
				if (buffer) {
					deferred.resolve(buffer);
				} else {
					AudioSound.load(path).then(function(buffer) {
						if (sound.path === path) {
							deferred.resolve(buffer);
						}
					}, function(error) {
						deferred.reject(error);
					});
				}
				return deferred.promise;
			},
			getSource: function() {
				var deferred = $q.defer();
				var sound = this;
				var source = sound.source;
				// console.log('AudioSound.getSource', source);
				if (source) {
					deferred.resolve(source);
				} else {
					sound.getBuffer().then(function(buffer) {
						var source = null;
						if (sound.playing) {
							source = sound.source;
							if (source) {
								if (typeof source.stop === 'function') {
									source.stop(0); // when
								} else {
									source.noteOff(0); // when
								}
								sound.disconnect();
							}
						}
						source = ctx.createBufferSource();
						source.buffer = buffer;
						sound.source = source;
						sound.connectNodes();
						deferred.resolve(source);
					}, function(error) {
						deferred.reject(error);
					});
				}
				return deferred.promise;
			},
			play: function() {
				var sound = this;
				if (!sound.playing) {
					var options = sound.options;
					sound.getSource().then(function(source) {
						// sound.stop();
						sound.startTime = ctx.currentTime;
						source.loop = options.loop;
						if (typeof source.start === 'function') {
							source.start(0, sound.offset); // when, offset, duration
						} else {
							source.noteOn(0, sound.offset); // when, offset, duration
						}
						sound.playing = true;
					});
				}
				// ctx.resume(); ???
				// console.log('AudioSound.play');
			},
			stop: function() {
				var sound = this;
				if (sound.playing) {
					var source = sound.source;
					if (source) {
						sound.offset += sound.startTime ? (ctx.currentTime - sound.startTime) : 0;
						// console.log(sound.offset);
						if (typeof source.stop === 'function') {
							source.stop(0); // when
						} else {
							source.noteOff(0); // when
						}
						sound.disconnect();
						sound.playing = false;
						// console.log('AudioSound.stop');
						// ctx.suspend(); ???
					}
				}
			},
			update: function() {
				var sound = this;
				if (sound.nodes.analyser) {
					sound.nodes.analyser.getByteFrequencyData(sound.data);
				}
			},
			setPath: function(path) {
				var sound = this;
				if (path && sound.path !== path) {
					sound.stop();
					sound.path = path;
					sound.offset = sound.options.offset || 0;
					console.log('AudioSound.setPath', path);
				}
			},
			setVolume: function(volume) {
				var sound = this;
				if (volume !== sound.options.volume) {
					sound.options.volume = volume;
					// suono di merda
					sound.nodes.gain.gain.value = 0; // volume;
				}
			},
		};

		function load(path, onprogress) {
			var deferred = $q.defer();
			var progress = {
				path: path,
				loaded: 0,
				total: 1,
			};
			var xhr = new XMLHttpRequest();
			xhr.open("GET", path, true);
			xhr.responseType = "arraybuffer"; // should be after open for ie11
			xhr.onload = function() {
				ctx.decodeAudioData(xhr.response, function(buffer) {
					if (!buffer) {
						console.log('AudioSound.load.decodeAudioData.error', path);
						deferred.reject('AudioSound.load.decodeAudioData.error');
						return;
					}
					// console.log('AudioSound.decodeAudioData', path);
					buffers[path] = buffer;
					deferred.resolve(buffer);
				});
			};
			xhr.onerror = function(error) {
				console.log('AudioManager.xhr.onerror', error);
				deferred.reject(error);
			};
			if (onprogress) {
				xhr.onprogress = function(e) {
					progress.loaded = e.loaded;
					progress.total = e.total;
					progress.progress = e.loaded / e.total;
					onprogress(progress);
				};
				/*
				xhr.onloadstart = function(e) {
				    progress.loaded = 0;
				    progress.total = 1;
				    progress.progress = 0;
				    onprogress(progress);
				};
				xhr.onloadend = function(e) {
				    progress.loaded = progress.total;
				    progress.progress = 1;
				    onprogress(progress);
				};
				*/
			}
			xhr.send();
			return deferred.promise;
		}

		AudioSound.load = load;

		return AudioSound;
    }]);

	app.service('AudioService', ['$rootScope', '$timeout', '$q', '$http', 'AudioSound', function($rootScope, $timeout, $q, $http, AudioSound) {

		var service = this;

		var sound = new AudioSound({
			analyser: true,
			loop: true,
		});

		function getData() {
			return sound.data;
		}

		function setStep() {
			var step = stepper.getCurrentStep();
			setItem(step.audio);
			// setPath(step.audio ? step.audio.path : null);
		}

		function setPath(path) {
			if (path) {
				sound.setPath(path);
				play();
			}
		}

		function setItem(item) {
			if (item && item.path) {
				service.item = item;
				service.active = true;
				setPath(item.path);
			}
		}

		function toggleItem(item) {
			if (item && item.path) {
				if (service.item && service.item.path === item.path) {
					toggle();
				} else {
					service.item = item;
					service.active = true;
					setPath(item.path);
				}
			}
		}

		function setVolume(volume) {
			sound.setVolume(volume);
		}

		function update() {
			if (service.active && sound.playing) {
				sound.setVolume(options.audio.volume);
				sound.update();
			}
		}

		function play() {
			if (service.active && sound.path && !sound.playing) {
				sound.play();
			}
		}

		function pause() {
			if (sound.playing) {
				sound.stop();
			}
		}

		function toggle() {
			service.active = !service.active;
			if (service.active) {
				play();
			} else {
				pause();
			}
		}

		function isItem(item) {
			return service.item && item && service.item.path == item.path;
		}

		function isActive(item) {
			var active = service.active && sound.playing && isItem(item);
			return active;
		}

		function isPlaying() {
			return sound.playing;
		}

		function preload(items, onprogress) {
			var deferred = $q.defer();
			var paths = {};
			var progress = {
				loaded: 0,
				total: 0,
			};

			function _onprogress(progress) {
				paths[progress.path] = progress;
				var p = 0;
				angular.forEach(paths, function(item) {
					progress.loaded += item.loaded;
					progress.total += item.total;
				});
				progress.progress = progress.loaded / progress.total;
				onprogress(progress);
			}
			$q.all(
				items.map(function(path) {
					return AudioSound.load(path, _onprogress);
				})
			).then(function() {
				progress.loaded = progress.total;
				progress.progress = 1;
				onprogress(progress);
				deferred.resolve();
			}, function(error) {
				console.log('AudioSound.preload.error', error);
				deferred.reject(error);
			});
			return deferred.promise;
		}

		$rootScope.$on('onOptionsChanged', function($scope) {
			sound.setVolume(options.audio.volume);
		});

		this.active = true;
		this.getData = getData;
		this.setVolume = setVolume;
		this.setPath = setPath;
		this.setItem = setItem;
		this.toggleItem = toggleItem;
		this.update = update;
		this.play = play;
		this.pause = pause;
		this.toggle = toggle;
		this.isPlaying = isPlaying;
		this.isItem = isItem;
		this.isActive = isActive;
		this.preload = preload;

    }]);

}());
