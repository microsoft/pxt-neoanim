namespace light {
    /**
     * Creates a neopixel animation from a raw buffer of colors.
     */
    //% help=reference/light/animation-sheet
    export function animationSheet(buffer: Buffer): NeoPixelAnimation {
        if (!buffer) return undefined;
        // check magic number
        if (buffer[0] != 0x2e ||
            buffer[1] != 0x0a ||
            buffer[2] != 0x21 ||
            buffer[3] != 0x88)
            return undefined;

        const animation = new BufferAnimation(buffer);
        return animation;
    }

    const AnimationSheetMagicNumber = 0x2e0a2188;

    class BufferAnimation extends NeoPixelAnimation {
        private bitmap: Buffer;

        constructor(bitmap: Buffer) {
            super();

            this.bitmap = bitmap;
        }

        createRenderer(strip: NeoPixelStrip): () => boolean {
            let start = -1;
            let step = 0;
            return () => {
                if (start < 0) {
                    step = 0;
                    start = control.millis();
                }

                // npalette
                const npalette = this.bitmap[4];
                // extract palette and frames
                const opalette = 6;
                const oframes = opalette + npalette * 3;

                const n = strip.length();
                let done = false;
                // the image is written row by row
                let offset = oframes + step * n;
                if (offset + n > this.bitmap.length) {
                    // last frame is missing images, reset step
                    step = 0;
                    offset = oframes;
                    done = true;
                }

                // scan colors starting at offset, lookup color and set in neopixel     
                for (let i = 0; i < n; i++) {
                    const k = i + offset;
                    const ci = this.bitmap[k];
                    if (ci < npalette) {
                        const c = rgb(
                            this.bitmap[opalette + ci * 3],
                            this.bitmap[opalette + ci * 3 + 1],
                            this.bitmap[opalette + ci * 3 + 2]);
                        strip.setPixelColor(i, c);
                    }
                }

                // increment step
                step++;
                return done;
            }
        }
    }
}