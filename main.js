// GCC HTML5 Gamepad input display
// Joe Marchesi

// Main file handles input values / controller detection

// Vars for controller detection in browser
let has_controller = false
let report_controller

// Init controller port
let controller_port = -1

// HTML5 digital input bindings with corresponding gamecube button labels. ONLY TESTED WITH GAMECUBE INPUTS VIA MAYFLASH
let digital_bindings = {
  button_a: 2,
  button_b: 3,
  button_x: 1,
  button_y: 4,
  button_z: 8,
  button_l: 5,
  button_r: 6,
  button_start: 10,
  dpad_l: 16,
  dpad_u: 13,
  dpad_r: 14,
  dpad_d: 15
}

// HTML5 analog input bindings with corresponding gamecube button labels. ONLY TESTED WITH GAMECUBE INPUTS VIA MAYFLASH
let analog_bindings = {
  joystick_x: 1,
  joystick_y: 2,
  cstick_x: 6,
  cstick_y: 3,
  trigger_l: 4,
  trigger_r: 5
}

// Object to hold current boolean values for controller state. Tracks pressed buttons.
let digital_values = {}

// Object to hold current analog values for controller axes (L / R, Sticks)
let analog_values = {}

// If browser supports HTML5 gamepads
function can_game(){
  return "getGamepads" in navigator
}

// Round analog values to gamecube rounding conventions (.0125 steps). Probably not 100% accurate to gamecube polling / interpretation.
function round_analog(num){
  return (Math.round(num * 80) / 80).toFixed(5)
}

// Looks for lowest active gamecube port. Determines active state by checking to see if a trigger value is not equal to -1, since an actual plugged in controller will be some decimal. This is not the best way of doing this, but it worked for my purposes.
function detect_port(){
  let controllers = navigator.getGamepads()

  controller_port = -1
  for(let i = 0; i < 4; i++){
    // Checks to see if a trigger value is not exactly -1
    if (controllers[i] && controllers[i].axes[3] !== -1) controller_port = i
  }

  // Display active controller
  if (controller_port === -1){
    $('#controllerPrompt').text("No Active Controller Detected")
  } else {
    $('#controllerPrompt').text("Adapter Connected - Polling From Port " + (controller_port+1))
  }
}

// Get the current state of digital and analog inputs by polling the controller
function report_on_controller(){ 

  // Determine active controller
  if(controller_port !== -1){
    let controller = navigator.getGamepads()[controller_port]
    
    // Get the pressed state of all controller buttons
    for (let i = 0; i < controller.buttons.length; i++){
      // digital_values is based off of digital bindings, which is not zero-indexed, hence 'i+1'
      // controller.buttons[i].pressed is the boolean pressed state
      digital_values[i+1] = controller.buttons[i].pressed
    }
    // Get analog state of all axes
    for (let i=0; i < controller.axes.length; i++) {
      // analog_values is based off of analog bindings, which is not zero-indexed, hence 'i+1'
      analog_values[i+1] = controller.axes[i]
    }
  
    // Print html input states
    print_inputs()
  }
}

// Prints input states as a raw html object and adds to the webpage.
function print_inputs(){
  let html = ""

  // Setup analog value vars since they'll be displayed then used again for rounding
  let value_jx = analog_values[analog_bindings["joystick_x"]]
  let value_jy = analog_values[analog_bindings["joystick_y"]]
  let value_cx = analog_values[analog_bindings["cstick_x"]]
  let value_cy = analog_values[analog_bindings["cstick_y"]]

  html += "A Button: " + digital_values[digital_bindings["button_a"]] + "<br/>"
  html += "B Button: " + digital_values[digital_bindings["button_b"]] + "<br/>"
  html += "X Button: " + digital_values[digital_bindings["button_x"]] + "<br/>"
  html += "Y Button: " + digital_values[digital_bindings["button_y"]] + "<br/>"

  html += "<br/>"

  html += "Start Button: " + digital_values[digital_bindings["button_start"]] + "<br/>"
  html += "Z Button: " + digital_values[digital_bindings["button_z"]] + "<br/>"
  html += "L Button: " + digital_values[digital_bindings["button_l"]] + "<br/>"
  html += "R Button: " + digital_values[digital_bindings["button_r"]] + "<br/>"

  html += "<br/>"
  
  html += "DPAD Up: " + digital_values[digital_bindings["dpad_u"]] + "<br/>"
  html += "DPAD Left: " + digital_values[digital_bindings["dpad_l"]] + "<br/>"
  html += "DPAD Down: " + digital_values[digital_bindings["dpad_d"]] + "<br/>"
  html += "DPAD Right: " + digital_values[digital_bindings["dpad_r"]] + "<br/>"
  
  html += "<br/>"
  
  html += "Joystick X: " + value_jx + "<br/>"
  html += "Joystick Y: " + value_jy + "<br/>"
  
  html += "<br/>"
  
  html += "Cstick X: " + value_cx + "<br/>"
  html += "Cstick Y: " + value_cy + "<br/>"
  
  html += "<br/>"
  
  html += "Trigger L: " + analog_values[analog_bindings["trigger_l"]] + "<br/>"
  html += "Trigger R: " + analog_values[analog_bindings["trigger_r"]] + "<br/>"

  $('#controllerTextDisplay').html(html)

  html = "<p><b>Note: these values do <em>not</em> exactly reflect values seen on a console. Use as an estimate.</b></p><br/>"

  // Display analog values first with fixed decimal spacing, then rounded
  html += "<p>Joystick X: " + value_jx.toFixed(5) + " (" + round_analog(value_jx) + ")</p>"
  html += "<p>Joystick Y: " + value_jy.toFixed(5)  + " (" + round_analog(value_jy) + ")</p>"

  html += "<br/><p>Cstick X: " + value_cx.toFixed(5)  + " (" + round_analog(value_cx) + ")</p>"
  html += "<p>Cstick Y: " + value_cy.toFixed(5)  + " (" + round_analog(value_cy) + ")</p>"

  $('#raw-values').html(html)

  if (display_loaded){
    update_display();
  }
}

$(document).ready(function(){

  // Initialize the controller svg image
  load_display();

  // If the browser supports html5 gamepads
  // Reference for connection logic https://gamedevelopment.tutsplus.com/tutorials/using-the-html5-gamepad-api-to-add-controller-support-to-browser-games--cms-21345
  if(can_game()){

    // Prompt for user input
    let prompt = "Connect your controller and press any button.";
    $('#controllerPrompt').text(prompt);

    // detect controller connect
    $(window).on("gamepadconnected", ()=>{
      has_controller = true;
      $("#controllerPrompt").text("Controller Connected");
      console.log("Connection Event");

      detect_port();

      // Poll controller inputs every 50ms
      report_controller = window.setInterval(report_on_controller, 50);
      
    });

    // detect controller disconnect
    $(window).on("gamepaddisconnected", ()=> {
      console.log("Disconnection Event");
      $("#controllerPrompt").text(prompt);
      window.clearInterval(report_controller);
    });

    // Check interval (Chrome)
    let check_controller = window.setInterval(()=> {

      if(navigator.getGamepads()[0]) {

        if(!has_controller){
          $(window).trigger("gamepadconnected");
        }

        window.clearInterval(check_controller);
      }
    }, 500);

  }

  // Display toggle for raw input values on the display
  $("#raw").on("click", function(){
    $('#raw-values').toggleClass('is-showing');
  });

  // Check controller port every 500ms
  setInterval(()=>{
    detect_port();
  }, 500);

});