namespace light {
    /**
     * Creates a neopixel animation from a raw buffer of colors.
     */
    //% help=reference/light/animation-sheet
    export function animationSheet(buffer: Buffer, interval: number): NeoPixelAnimation {
        const animation = new BufferAnimation(buffer, interval);
        return animation;
    }

    const AnimationSheetMagicNumber = 0x2e0a21;

    class BufferAnimation extends NeoPixelAnimation {
        private bitmap: Buffer;
        private interval: number;
        private step: number;

        constructor(bitmap: Buffer, interval: number) {
            super();

            this.bitmap = bitmap;
            this.interval = Math.max(1, interval);
            this.step = 0;
        }

        public showFrame(strip: NeoPixelStrip): void {
            if (this.start < 0) {
                this.step = 0;
                this.start = control.millis();
            }

            // check magic number
            if (this.bitmap.getNumber(NumberFormat.UInt32LE, 0) != AnimationSheetMagicNumber)
                return;

            // npalette
            const npalette = this.bitmap[4];
            // extract palette and frames
            const palette = this.bitmap.slice(6, npalette * 3);
            const frames = this.bitmap.slice(6 + palette.length);

            const n = strip.length();            
            // the image is written row by row
            let offset = this.step * n;
            if (offset + n > frames.length) {
                // last frame is missing images, reset step
                this.step = 0;
                offset = 0;
            }

            const bf = strip.buffered();
            strip.setBuffered(true);
            // scan colors starting at offset, lookup color and set in neopixel     
            for (let i = 0; i < n; i++) {
                const k = i + offset;
                const ci = frames[k];
                const c = rgb(palette[ci], palette[ci + 1], palette[ci + 2]);
                strip.setPixelColor(i, c);
            }
            strip.show();
            strip.setBuffered(bf);

            // sleep
            loops.pause(this.interval);

            // increment step
            this.step = this.step % n;
        }
    }
}