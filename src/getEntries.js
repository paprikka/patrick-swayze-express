import { Observable } from 'rxjs/Rx'


const throwMissingWindow$ = () =>
    Observable
        .throw( new Error( 'Please provide a window instance as the first argument.' ) )


const getEntriesWatcher$ = win =>
    Observable
        .timer( 0, 200 )
        .mergeMap( () => Observable.from( win.performance.getEntries() ) )
        .distinct()


export const getEntries$ = windowOrContentWindow =>
    Observable
        .of( windowOrContentWindow )
        .mergeMap( win =>
            ( win
                ? getEntriesWatcher$( win )
                : throwMissingWindow$() ) )

