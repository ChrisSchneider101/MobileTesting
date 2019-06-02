//one of, uniquely specifies premade button div
Button = function(game) {
	this.div = document.getElementById("thebutton");
	this.game = game;
	
	this.touchStart = function() {
		document.body.style.backgroundColor = "rgb(100,100,255)";
	}
	
	this.touchEnd = function() {
		document.body.style.backgroundColor = "rgb(255,100,100)";
	}
	
	return this;
}

//one of, uniquely specifies button object
Game = function() {
	this.button = new Button(this);
	this.level;
	this.timer_interval;
	
	
	this.initPlayerName = function() {
		var attempt = 0;
		var entered_name = prompt("Welcome Gamer, what is your game name?\n(Please be careful, changing this later will not be free)","");
		while (entered_name == "" || entered_name == null) {
			attempt++;
			switch (attempt) {
				case 1:
					entered_name = prompt("Wait! I understand you are excited to give me your money, but please give me your name first!","");
					break;
				case 2:
					entered_name = prompt("Your name, Gamer, your name! What is it?","");
					break;
				case 3:
					entered_name = prompt("Hmm, perhaps you need some assistance, lets try this:","Gamer");
					break;
				case 4:
					entered_name = prompt("Your doing this on purpose aren't ya?","");
					break;
				case 5:
					entered_name = prompt("You think your funny don't ya?","I think I'm funny");
					break;
				case 6:
					entered_name = prompt("You are stubborn Gamer unless you state otherwise.","");
					break;
				case 7:
					entered_name = "Stubborn Gamer";
					break;
				default:
					entered_name = "Default Gamer";
					break;
				
			}
		}
		setCookie("player_name", entered_name);
	}
	
	this.calcSecondsInLevel = function(lvl) {
		return Math.round(10 + Math.pow(1.3, 1.33 * lvl));
	}
	
	this.getSecondsLeft = function() {
		var now = new Date();
		var end = new Date(getCookie("timer_end"));
		return Math.round((end - now) / 1000);
	}
	
	//used for level up timer setting and timer reductions
	this.setReadyTime = function(seconds) {
		var timer_end_date = new Date();
		timer_end_date.setSeconds(timer_end_date.getSeconds() + seconds);
		setCookie("timer_end", timer_end_date.toUTCString());
		//this.sec_left = seconds;
	}
	
	this.getReadyTime = function() {
		return getCookie("timer_end");
	}
	
	this.updateOnscreenTimer = function(seconds) {
		var timer = document.getElementById("timer");
		var seconds_left = seconds;
		timer.innerHTML = seconds_left;
		clearInterval(this.timer_interval);
		this.timer_interval = setInterval(function() {
			if (seconds_left > 0) seconds_left--;
			else clearInterval(this.timer_interval);
			timer.innerHTML = seconds_left;
		}.bind(this), 1000);
	}
	
	this.setLevel = function(level) {
		setCookie("level", level.toString());
	}
	
	this.getLevel = function() {
		return parseInt(getCookie("level"));
	}
	
	this.updateOnscreenLevel = function(level) {
		document.getElementById("level").innerHTML = level;
	}
	
	this.prepareLevel = function(lvl) {
		this.setReadyTime(this.calcSecondsInLevel(lvl));
		this.updateOnscreenTimer(this.getSecondsLeft());
		this.updateOnscreenLevel(lvl);
	}
	
	this.levelUp = function() {
		this.setLevel(this.getLevel() + 1);
		this.prepareLevel(this.getLevel());
	}
	
	this.onPageLoad = function() {
		// first page load
		if (getCookie("player_name") == "" || getCookie("player_name") == null) {
			this.initPlayerName();
			this.setLevel(1);
			this.prepareLevel(1);
			//this.sec_left = this.calcSecondsInLevel();
			//this.setTimerEnd(this.calcSecondsInLevel());
			
		}
		
		// nonfirst page load
		
		// every page load
		document.getElementById("username").innerHTML = getCookie("player_name");
		this.updateOnscreenLevel(this.getLevel());
		var seconds_left = this.getSecondsLeft();
		console.log(seconds_left);
		
		if (seconds_left <= 0) {
			console.log("timer is up!");
			document.getElementById("timer").innerHTML = seconds_left;
			//seconds_left negative, corresponds to wasted time
		}
		else {
			console.log("timer is continuing!");
			this.updateOnscreenTimer(seconds_left);
			this.updateOnscreenLevel(this.getLevel());
			//seconds_left positive, still waiting to be ready
		}
		
		//setInterval if timer is not up
	}
	
	this.onPageUnload = function(event) {
		//setCookie("timer_end", num.toString(this.level));
	}
	
	
	this.onPageLoad();
	//window.addEventListener("beforeunload", this.onPageUnload.bind(this));
	
	return this;
}