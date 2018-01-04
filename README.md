# neoanim

A neopixel animation based on bitmaps [![Build Status](https://travis-ci.org/Microsoft/pxt-neoanim.svg?branch=master)](https://travis-ci.org/Microsoft/pxt-neoanim)

# Animation Sheet

Creates an animation from a pre-rendered set of frames

```sig
light.animationSheet(null)
```

## Parameters

* ``buffer``, the buffer containing the data (more below)

## Animation editor

From the https://makecode.adafruit.com editor, 
* click on **Add Package**
* add **neoanim**
* go to the **Lights** category and click on **Animation Editor**

## Buffer format

The bitmap format should be specified as follows. All values are little endian.

* magic number ``0x2e0a2188``, 4 bytes
* palette size, 1 byte (``npalette``)
* reserved padding, 1 byte
* palette, ``npalette`` x 24bit RGB colors
* frames, ``nleds`` x number of frames. A contiguous sequence of palette color indices.

## Example

### Generating your own animation

The following sample generates a buffer and uses it to create the animation.

```typescript
const strip = light.createStrip();
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
let anim = light.animationSheet(sheet);

loops.forever(() => {
    strip.showAnimation(anim, 10000);
})
```

## License

MIT

## Supported targets

* for PXT/adafruit
* for PXT/codal
(The metadata above is needed for package search.)
