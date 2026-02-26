/**
 * BH1750FVI -valosensori (I2C 0x23)
 * Kalibroitu lineaarikorjaus: lux ≈ 2.21 * mittaus - 19
 */
//% color=#00A86B icon="\uf185" block="BH1750"
namespace BH1750 {

    const ADDR = 0x23
    const CONT_HIRES_MODE = 0x10
    const POWER_ON = 0x01
    const RESET = 0x07

    let initialized = false
    let viimeisinLux = 0

    // Kalibrointikertoimet
    const A = 2.21
    const B = -19

    function writeByte(cmd: number): void {
        const buf = pins.createBuffer(1)
        buf[0] = cmd
        pins.i2cWriteBuffer(ADDR, buf)
    }

    function readRaw(): number {
        const buf = pins.i2cReadBuffer(ADDR, 2)
        return (buf[0] << 8) | buf[1]
    }

    /**
     * Alusta valoanturi
     */
    //% block="Alusta valoanturi"
    export function alustaValoanturiBH1750(): void {
        writeByte(POWER_ON)
        basic.pause(10)
        writeByte(RESET)
        basic.pause(10)
        writeByte(CONT_HIRES_MODE)
        basic.pause(180)
        initialized = true
    }

    /**
     * Lue valoanturi (päivittää mittauksen)
     */
    //% block="Lue valoanturi"
    export function lueValoanturiBH1750(): void {

        if (!initialized) {
            alustaValoanturiBH1750()
        }

        basic.pause(180)

        const raw = readRaw()

        // Datasheet-muunnos
        let lux = raw / 1.2

        // Kalibrointikorjaus
        lux = A * lux + B

        if (lux < 0) lux = 0

        viimeisinLux = Math.round(lux)
    }

    /**
     * Valoisuus (lx)
     */
    //% block="Valoisuus (lx)"
    export function valoisuus(): number {
        return viimeisinLux
    }
}