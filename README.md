## Install

    $ npm i @sonnet.io/patrick-swayze-express

## Usage

    // getEntries$: (window: Window) => Observable<PerformanceEntry>

    import { getEntries$ } from '@sonnet.io/patrick-swayze-express'

    getEntries$(window).subscribe(
        entry => console.log('Entry:', entry)
    )
