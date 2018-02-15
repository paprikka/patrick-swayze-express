import {
    Observable,
    TestScheduler,
} from 'rxjs/Rx'

import { getEntries$ } from './getEntries'

describe( 'getEntries$', () => {
    let scheduler
    beforeEach( () => {
        jest.clearAllMocks()
        scheduler = new TestScheduler( ( a, b ) => {
            expect( a ).toEqual( b )
        } )
    } )

    it( 'should be a function', () => {
        expect( typeof getEntries$ ).toBe( 'function' )
    } )

    it( 'should return an Observable', () => {
        expect( getEntries$() ).toBeInstanceOf( Observable )
    } )

    it( 'should throw if no window/frame.contentWindow provided', async () => {
        const result = await getEntries$().catch( _ => Observable.of( _ ) ).toPromise()

        expect( result ).toEqual( new Error( 'Please provide a window instance as the first argument.' ) )
    } )

    it( 'should return the initial performance entries as separate events', () => {
        const mockEntries = [
            'entry_0',
            'entry_1',
            'entry_2',
        ]

        spyOn( Observable, 'timer' ).and.returnValue( scheduler.createHotObservable( 'x|' ) )
        const mockWindow = {
            performance: {
                getEntries: jest.fn().mockReturnValue( mockEntries ),
            },
        }
        const results = []
        getEntries$( mockWindow ).subscribe( results.push.bind( results ) )
        scheduler.flush()

        expect( results ).toEqual( [ 'entry_0', 'entry_1', 'entry_2' ] )
    } )

    it( 'should poll performance entries and push when a new entry is available', () => {
        spyOn( Observable, 'timer' ).and.returnValue( scheduler.createHotObservable( 'x-x-x--|' ) )
        const mockGetEntries = jest.fn()
        const mockWindow = {
            performance: {
                getEntries: mockGetEntries,
            },
        }

        mockGetEntries.mockReturnValueOnce( [ 'entry_0' ] )
        mockGetEntries.mockReturnValueOnce( [ 'entry_0', 'entry_1' ] )
        mockGetEntries.mockReturnValueOnce( [ 'entry_0', 'entry_1', 'entry_2' ] )

        const results = []
        const handleResult = jest.fn().mockImplementation( val => results.push( val ) )
        getEntries$( mockWindow ).subscribe( handleResult )
        scheduler.flush()

        expect( handleResult ).toHaveBeenCalledTimes( 3 )
        expect( results ).toEqual( [
            'entry_0',
            'entry_1',
            'entry_2',
        ] )
    } )
} )
