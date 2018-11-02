// GCC HTML5 Gamepad input display
// Joe Marchesi

// Display file handles displaying input values on SVG display.

// Will store jquery objects that correspond to the SVG elements for controller buttons
let display_a, display_b, display_x, display_y, display_z, display_l, display_r, display_start, display_dpad_u, display_dpad_l, display_dpad_d, display_dpad_r, display_joystick, display_cstick, display_joystick_nub, display_cstick_nub

// Colors to use for buttons
let color_black = "#000000"
let color_white = "#ffffff"
let color_grey = "#c6c6c6"
let color_dark_grey = "#8c8c8c"
let color_green = "#00d631"
let color_dark_green = "#00801e"
let color_red = "#ff0808"
let color_dark_red = "#990000"
let color_purple = "#a114ff"
let color_dark_purple = "#6b00b3"
let color_yellow = "#fff544"

// whether or not SVG has been initialized
let display_loaded = false

// Store percentage of shoulder values as well as a color that corresponds to the percentage
let l_percent
let r_percent
let l_value
let r_value
let l_rgb
let r_rgb

// Attempt to initialize the jquery objects
// Once the <img> has been converted to <svg>, this will init_buttons()
function load_display(){
  // svg.js will convert <img> elements with the 'svg' class into <svg> elements. Once converted, said elements will contain 'replaced-svg' in their classlist
  if(document.getElementById('display').classList.contains('replaced-svg')){
    init_buttons();
  } else {
    setTimeout(load_display, 15);
  }
}

// Update the svg styling to show the button values
function update_display(){

  // For every button, check the digital value (by looking up the digital binding)
  // digital_values is structured as: {"n" : boolean} with n being the binding for that button
  // if the value is 'true', that button is pressed. false if not
  // fill and stroke the svg values differently whether or not the button is pressed

  if(digital_values[digital_bindings["button_a"]]){
    fill_display_element(display_a, color_dark_green)
    stroke_display_element(display_a, color_white)
  } else {
    fill_display_element(display_a, color_green)
    stroke_display_element(display_a, color_green)
  }

  if(digital_values[digital_bindings["button_b"]]){
    fill_display_element(display_b, color_dark_red)
    stroke_display_element(display_b, color_white)
  } else {
    fill_display_element(display_b, color_red)
    stroke_display_element(display_b, color_red)
  }

  if(digital_values[digital_bindings["button_x"]]){
    fill_display_element(display_x, color_dark_grey)
    stroke_display_element(display_x, color_white)
  } else {
    fill_display_element(display_x, color_grey)
    stroke_display_element(display_x, color_grey)
  }

  if(digital_values[digital_bindings["button_y"]]){
    fill_display_element(display_y, color_dark_grey)
    stroke_display_element(display_y, color_white)
  } else {
    fill_display_element(display_y, color_grey)
    stroke_display_element(display_y, color_grey)
  }

  if(digital_values[digital_bindings["button_start"]]){
    fill_display_element(display_start, color_dark_grey)
    stroke_display_element(display_start, color_white)
  } else {
    fill_display_element(display_start, color_grey)
    stroke_display_element(display_start, color_grey)
  }

  if(digital_values[digital_bindings["button_l"]]){
    fill_display_element(display_l, color_dark_grey)
    stroke_display_element(display_l, color_white)
  } else {
    fill_display_element(display_l, l_rgb)
    stroke_display_element(display_l, l_rgb)
  }

  if(digital_values[digital_bindings["button_r"]]){
    fill_display_element(display_r, color_dark_grey)
    stroke_display_element(display_r, color_white)
  } else {
    fill_display_element(display_r, r_rgb)
    stroke_display_element(display_r, r_rgb)
  }

  if(digital_values[digital_bindings["button_z"]]){
    fill_display_element(display_z, color_dark_purple)
    stroke_display_element(display_z, color_white)
  } else {
    fill_display_element(display_z, color_purple)
    stroke_display_element(display_z, color_purple)
  }

  if(digital_values[digital_bindings["dpad_u"]]){ 
    fill_display_element(display_dpad_u, color_dark_grey)
    stroke_display_element(display_dpad_u, color_white)
  } else {
    fill_display_element(display_dpad_u, color_grey)
    stroke_display_element(display_dpad_u, color_grey)
  }

  if(digital_values[digital_bindings["dpad_d"]]){
    fill_display_element(display_dpad_d, color_dark_grey)
    stroke_display_element(display_dpad_d, color_white)
  } else {
    fill_display_element(display_dpad_d, color_grey)
    stroke_display_element(display_dpad_d, color_grey)
  }

  if(digital_values[digital_bindings["dpad_l"]]){
    fill_display_element(display_dpad_l, color_dark_grey)
    stroke_display_element(display_dpad_l, color_white)
  } else {
    fill_display_element(display_dpad_l, color_grey)
    stroke_display_element(display_dpad_l, color_grey)
  }

  if(digital_values[digital_bindings["dpad_r"]]){
    fill_display_element(display_dpad_r, color_dark_grey)
    stroke_display_element(display_dpad_r, color_white)
  } else {
    fill_display_element(display_dpad_r, color_grey)
    stroke_display_element(display_dpad_r, color_grey)
  }

  // Calculate the percentage of the l and r analog values
  l_percent = (analog_values[analog_bindings["trigger_l"]] + 1) / 2
  r_percent = (analog_values[analog_bindings["trigger_r"]] + 1) / 2

  // Create an rgb value with the range 120-220, based on the percentage
  // If L or R is fully (100%) pressed, the RGB value will be lower (darker)
  l_value = 220 - (100 * l_percent)
  r_value = 220 - (100 * r_percent)

  // Fill with the new rgb value
  l_rgb = "rgb(" + parseInt(l_value) + ", " + parseInt(l_value) + ", " + parseInt(l_value) + ")"
  r_rgb = "rgb(" + parseInt(r_value) + ", " + parseInt(r_value) + ", " + parseInt(r_value) + ")"


  // Move the stick nub elements depending on the joystick / cstick x and y offsets
  move_display_element(display_joystick_nub, analog_values[analog_bindings["joystick_x"]], analog_values[analog_bindings["joystick_y"]])
  move_display_element(display_cstick_nub, analog_values[analog_bindings["cstick_x"]], analog_values[analog_bindings["cstick_y"]])

}

// Initialize the jQuery objects that point to the buttons on the svg display
function init_buttons(){
  display_loaded = true

  display_a = $('#display #display_a')
  display_b = $('#display #display_b')
  display_x = $('#display #display_x')
  display_y = $('#display #display_y')
  
  display_z = $('#display #display_z')
  display_start = $('#display #display_start')
  display_l = $('#display #display_l')
  display_r = $('#display #display_r')

  display_dpad_u = $('#display #display_dpad_u')
  display_dpad_r = $('#display #display_dpad_r')
  display_dpad_l = $('#display #display_dpad_l')
  display_dpad_d = $('#display #display_dpad_d')
  
  display_joystick = $('#display #display_joystick')
  display_cstick = $('#display #display_cstick')

  fill_display_element(display_joystick, color_grey)

  // Nubs utilize js DOM and not jquery, so their ids are stored instead
  display_joystick_nub = "display_joystick_nub";
  display_cstick_nub = 'display_cstick_nub';
}

// Translate an svg element by an x and y offset
function move_display_element(idStr, xOffset, yOffset) {
  let scale = 60 // Scale is how many pixels a value of '1' will move. This is high because the offsets are expected to be between -1 and 1
  let domElemnt = document.getElementById(idStr);
    if (domElemnt) {
      let transformAttr = ' translate(' + xOffset * scale + ',' + yOffset * scale + ')';
      domElemnt.setAttribute('transform', transformAttr);
    }
  }

// Add css fill styling to jquery element
function fill_display_element(area, color){
  area.css('fill', color);
}

// Add css stroke styling to jquery element
function stroke_display_element(area, color){
  area.css('stroke', color);
}
