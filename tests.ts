const strip = light.pixels;
const nleds = strip.length();
const ncolors = 3;
const nframes = 10;
const sheet = pins.createBuffer(6 + ncolors * 3 + nleds * nframes);
const palette = sheet.slice(6, ncolors * 3);
const frames = sheet.slice(6 + palette.length);

// magic number
sheet.setNumber(0, NumberFormat.UInt32LE, 0x2e0a21);
// palette
sheet[4] = ncolors;
palette[0] = 0xff; // red
palette[4] = 0xff; // green
palette[8] = 0xff; // blue
// filing up colors
let k = 0;
for (let i = 0; i < nleds; ++i) {
    for (let j = 0; j < nframes; ++j) {
        frames[k++] = i + j % ncolors;
    }
}
let anim = light.animationSheet(sheet, 50);

loops.forever(() => {
    strip.showAnimation(anim, 10000);
})