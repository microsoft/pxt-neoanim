
const strip = light.pixels;
const nleds = strip.length();
const ncolors = 3;
const nframes = 2;
const sheet = pins.createBuffer(6 + ncolors * 3 + nleds * nframes);
const opalette = 6;
const oframes = opalette + ncolors * 3;

// magic number
//sheet.setNumber(0, NumberFormat.UInt32BE, 0x2e0a2188);
// palette
sheet[4] = ncolors;
sheet[opalette + 0] = 0xff; // red
sheet[opalette + 4] = 0xff; // green
sheet[opalette + 8] = 0xff; // blue
// filing up colors
let k = 0;
for (let i = 0; i < nleds; ++i) {
    for (let j = 0; j < nframes; ++j) {
        sheet[oframes + k] = k % ncolors;
        k++;
    }
}
let anim = light.animationSheet(sheet, 50);

strip.showAnimationFrame(anim);
input.buttonA.onEvent(ButtonEvent.Down, () => {
    strip.showAnimationFrame(anim);
})
