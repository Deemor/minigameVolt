    
    digit_img = [];
    cyfry = ['img/0.png','img/1.png','img/2.png','img/3.png','img/4.png','img/5.png','img/6.png','img/7.png','img/8.png','img/9.png'];
    cyfry.forEach(function(item, index, array)	{
        digit_img.push(new Image());
        digit_img[digit_img.length - 1].src = item;
    });
//bateria
    battery_img = new Image();
	battery_img.src = 'img/battery.png';
//lewe piny kolorki
    left_pin_img = new Map();

    left_pin_red = new Image();
	left_pin_red.src = 'img/red.png';
    left_pin_img.set("red", left_pin_red)

    left_pin_green = new Image();
	left_pin_green.src = "img/green.png";
    left_pin_img.set("green", left_pin_green)

    left_pin_blue = new Image();
	left_pin_blue.src = "img/blue.png";
    left_pin_img.set("blue", left_pin_blue)
//tlo
    background_img = new Image();
	background_img.src = 'img/voltlab.png';
//polaczenia
    pin_connections_img = [
        [ new Image(),new Image(),new Image()],
        [ new Image(),new Image(),new Image()],
        [ new Image(),new Image(),new Image()]
    ];
//czerwony pin polaczenia
    pin_connections_img[0][0].src = "img/reda.png";
    pin_connections_img[0][1].src = "img/redb.png";
    pin_connections_img[0][2].src = "img/redc.png";
//zielony pin polaczenia
    pin_connections_img[1][0].src = "img/greena.png";
    pin_connections_img[1][1].src = "img/greenb.png";
    pin_connections_img[1][2].src = "img/greenc.png";
//niebieski pin polaczenia
    pin_connections_img[2][0].src = "img/bluea.png";
    pin_connections_img[2][1].src = "img/blueb.png";
    pin_connections_img[2][2].src = "img/bluec.png";
//sound
    var key_switch_sound = new Audio('audio/key_switch.mp3');
    var switch_sound = new Audio('audio/switch.mp3');
    var loading_sound = new Audio('audio/loading.mp3');


    class LeftPin
    {
        position;
        value;
        ctx;
        connections = [false, false, false];
        focus = -1;
        constructor(context, pos) {
            this.ctx = context;
            this.position = pos;
            this.value = 1+ Math.floor(Math.random() * 9);
        }
        draw_connections()
        {
            var focus_and_connections = [];
            this.connections.forEach(function(item, index, array)	{
                focus_and_connections.push(item);
            });
            if(this.focus >= 0 && this.focus <= 2)
            {
                focus_and_connections[this.focus] = true;
            }

            var self = this;
            focus_and_connections.forEach(function(item, index, array)	{
                if(item)
                {
                    self.ctx.drawImage(pin_connections_img[self.position][index], 0, 0);
                }
            });
        }
        right_control()
        {
            this.focus = this.focus + 1;
            if(this.focus == 3)
            {
                this.focus = 0;
            }
        }
        left_control()
        {
            this.focus = this.focus - 1;
            if(this.focus == -1)
            {
                this.focus = 2;
            }
        }
        get_connection_index()
        {
            if(this.connections[0] == true)
            { return 0; }
            if(this.connections[1] == true)
            { return 1; }
            if(this.connections[2] == true)
            { return 2; }
            else { return -1; }
        }
        is_connected()
        {
            if(this.connections[0] == true)
            return true;
            else if(this.connections[1] == true)
            return true;
            else if(this.connections[2] == true)
            return true;
            else return false;
        }
    }
    
	class VoltLab {
        cyfraWidth = 83;
        cyfraHeight = 106;
        targetValue = ['1','2','3'];
        multipliers = ['1','10','50'];
        target = 0;
        result = 0;
        focusKey = 0;
        batteries = 6;
        battery_charge = 7;
        is_end = false;
        left_pins;
		constructor() {
			this.layerBackground = document.getElementById("layerBackground").getContext("2d");
            this.layerBattery = document.getElementById("layerBattery").getContext("2d");
            this.layerResult = document.getElementById("layerResult").getContext("2d");
            this.layerConnections = document.getElementById("layerConnections").getContext("2d");
            this.left_pins = [new LeftPin(this.layerConnections,0),new LeftPin(this.layerConnections,1),new LeftPin(this.layerConnections,2)];
            this.left_pins[0].focus=0;
			this.generate_key();
            this.generate_multipliers();
		}
        start()
        {
            this.draw_layerBackground();
            this.draw_layerBattery();
            this.draw_layerResult();
            this.draw();
            window.addEventListener('keydown',this.check.bind(this),false);
            this.time_event_battery();
        }
        animation_connections()
        {
            document.getElementById("layerConnections").animate([
                { opacity: '1' },
                { opacity: '0.4' }
              ], {
                duration: 200,
                iterations: 3
              });
        }
		check(e) {
            if(!this.is_end)
            {
                var code = e.keyCode;
                switch (code) {
                case 37: 
                    key_switch_sound.play();
                    this.left_pins[this.focusKey].left_control(); 
                    this.draw();  
                    break; //Left key
                case 38: 
                    key_switch_sound.play();
                    this.left_pins[this.focusKey].focus = -1;
                    this.up_control(); 
                    this.left_pins[this.focusKey].focus = 0; 
                    this.draw(); 
                    break; //Up key
                case 39: 
                    key_switch_sound.play();
                    this.left_pins[this.focusKey].right_control();
                    this.draw(); 
                break; //Right key
                case 40: 
                    key_switch_sound.play();
                    this.left_pins[this.focusKey].focus = -1; 
                    this.down_control(); 
                    this.left_pins[this.focusKey].focus = 0; 
                    this.draw(); 
                    break; //Down key
                case 13: 
                    if(this.left_pins[this.focusKey].connections[0] == false && this.left_pins[this.focusKey].connections[1] == false &&
                        this.left_pins[this.focusKey].connections[2] == false)
                        {
                            if(this.left_pins[0].connections[this.left_pins[this.focusKey].focus] +
                            this.left_pins[1].connections[this.left_pins[this.focusKey].focus] +
                            this.left_pins[2].connections[this.left_pins[this.focusKey].focus] == 0)
                            {
                                this.left_pins[this.focusKey].connections[this.left_pins[this.focusKey].focus] = true;
                                this.animation_connections();
                                switch_sound.play();
                                this.check_end();
                            }
                        }
                break;
                //default: alert(code); //Everything else
                    }
            }
		}
        sub_battery_charge()
        {
            this.battery_charge = this.battery_charge - 1;
            this.check_end();
            if(this.battery_charge < 0)
            {
                this.battery_charge = 3;
                this.batteries = this.batteries - 1;
                
                this.draw_layerBattery();
            }
        }
        time_event_battery()
        {
            if(!this.is_end)
            {
                var self = this;
                window.setTimeout(function() {
                    self.sub_battery_charge();
                    self.time_event_battery();
                }, 500); 
            }
        }
        check_end()
        {
            this.calculate_result();
            if(this.batteries == 0 && this.battery_charge <= 4)
            {
                this.fail_end();
            }
            if(this.left_pins[0].is_connected() + this.left_pins[1].is_connected() + this.left_pins[2].is_connected() == 3)
            {
                if(this.result == this.target)
                {
                    this.success_end();
                }else
                this.fail_end();
            }
        }
        
        success_end()
        {
            this.is_end = true;
            loading_sound.play();
            document.getElementById("scene").style.display="none";
            window.removeEventListener('keydown',this.check.bind(this),false);
            document.getElementById("goodEnding").style.display="block";
        }
        fail_end()
        {
            this.is_end = true;
            loading_sound.play();
            document.getElementById("scene").style.display="none";
            window.removeEventListener('keydown',this.check.bind(this),false);
            document.getElementById("badEnding").style.display="block";
        }
		generate_key()
		{
			this.left_pins[0].value = 1+ Math.floor(Math.random() * 9);
			this.left_pins[1].value = 1+ Math.floor(Math.random() * 9);
			this.left_pins[2].value = 1+ Math.floor(Math.random() * 9);
			this.target = this.left_pins[0].value*1 + this.left_pins[1].value*10 + this.left_pins[2].value*50;
			if(this.target < 100)
			{
				this.targetValue[0] = 0;
				this.targetValue[1] = (''+this.target)[0];
				this.targetValue[2] = (''+this.target)[1];
			}else
			{
				this.targetValue[0] = (''+this.target)[0];
				this.targetValue[1] = (''+this.target)[1];
				this.targetValue[2] = (''+this.target)[2];
			}
		}
        down_control()
        {
            this.focusKey = this.focusKey + 1;
            if(this.focusKey > 2)
            {
                this.focusKey = 0;
            }
            this.draw();
        }
        up_control()
        {
            this.focusKey = this.focusKey - 1;
            if(this.focusKey < 0)
            {
                this.focusKey = 2;
            }
            this.draw();
        }
        calculate_result()
        {
            this.result = 0;
            for(var i = 0; i < 3; i++)
            {
                if(this.left_pins[i].get_connection_index() != -1)
                {
                    this.result = this.result + this.left_pins[i].value*this.multipliers[this.left_pins[i].get_connection_index()];
                }
            }
        }
        generate_multipliers()
        {
            this.multipliers = this.multipliers.sort(() => Math.random() - 0.5);
        }
		draw_layerBackground()
		{
            this.layerBackground.drawImage(background_img, 0, 0);
            this.draw_target();
            this.draw_left_pin_numbers();
		}
		draw_target()
		{
            this.layerBackground.drawImage(digit_img[parseInt(this.targetValue[0])], 384, 34);
            this.layerBackground.drawImage(digit_img[parseInt(this.targetValue[1])], 384 + this.cyfraWidth, 34);
            this.layerBackground.drawImage(digit_img[parseInt(this.targetValue[2])], 384 + this.cyfraWidth + this.cyfraWidth, 34);
		}  
        draw_layerResult()
		{
            this.layerResult.clearRect(384, 714, 384 + 3*this.cyfraWidth, 714+this.cyfraHeight);
            
            this.calculate_result();

            var t_result = this.result;
            if(this.left_pins[this.focusKey].focus != -1)
            {
                if(this.left_pins[this.focusKey].connections[this.left_pins[this.focusKey].focus] == false)
                this.result = this.result + this.left_pins[this.focusKey].value*this.multipliers[this.left_pins[this.focusKey].focus];
            }
            if(this.result < 10){
                this.layerResult.drawImage(digit_img[0], 384, 714);
                this.layerResult.drawImage(digit_img[0], 384 + this.cyfraWidth, 714);
                this.layerResult.drawImage(digit_img[this.result], 384 + this.cyfraWidth + this.cyfraWidth, 714);
            }else if(this.result < 100){
                this.layerResult.drawImage(digit_img[0], 384, 714);
                this.layerResult.drawImage(digit_img[parseInt((''+this.result)[0])], 384 + this.cyfraWidth, 714);
                this.layerResult.drawImage(digit_img[parseInt((''+this.result)[1])], 384 + this.cyfraWidth + this.cyfraWidth, 714);
            }else{
                this.layerResult.drawImage(digit_img[parseInt((''+this.result)[0])], 384, 714);
                this.layerResult.drawImage(digit_img[parseInt((''+this.result)[1])], 384 + this.cyfraWidth, 714);
                this.layerResult.drawImage(digit_img[parseInt((''+this.result)[2])], 384 + this.cyfraWidth + this.cyfraWidth, 714);
            }
            this.result = t_result;
		}
		draw_left_pin_numbers()
		{
            this.layerBackground.drawImage(digit_img[this.left_pins[0].value], 67, 167);
            this.layerBackground.drawImage(digit_img[this.left_pins[1].value], 67, 375);
            this.layerBackground.drawImage(digit_img[this.left_pins[2].value], 67, 583);
		}
		draw_left_pin_focused_color()
		{
			if(this.focusKey == 0){
                this.layerConnections.drawImage(left_pin_img.get("red"), 62, 164);
			}
			if(this.focusKey == 1){
                this.layerConnections.drawImage(left_pin_img.get("green"), 62, 372);
			}
			if(this.focusKey == 2){
                this.layerConnections.drawImage(left_pin_img.get("blue"), 62, 581);
			}
		}
        draw_left_pin_connections()
        {
            
            this.layerConnections.clearRect(0, 0, 1013, 859);

            this.left_pins.forEach(function(item, index, array)	{
            item.draw_connections();
            });    
        }
        draw_layerBattery()
        {
            this.layerBattery.clearRect(0, 0, 1013, 859);
            for (var i = 0; i < this.batteries; i++) {
                this.layerBattery.drawImage(battery_img, 277 - i*19, 747);
            }
        }
		draw() 
		{
            this.draw_left_pin_connections();
			this.draw_left_pin_focused_color();
            this.draw_layerResult();
		}
		
    }
        


	
	
		
	
	
	
