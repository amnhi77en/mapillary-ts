import { Subject } from "rxjs";

import { ContainerMockCreator } from "../helper/ContainerMockCreator";
import { NavigatorMockCreator } from "../helper/NavigatorMockCreator";
import { EventEmitter } from "../../src/util/EventEmitter";
import { Observer } from "../../src/viewer/Observer";
import { Viewer } from "../../src/viewer/Viewer";
import { ViewerDataLoadingEvent } from "../../src/viewer/events/ViewerDataLoadingEvent";
import { LngLatAlt } from "../../src/api/interfaces/LngLatAlt";
import { ViewerStateEvent } from "../../src/viewer/events/ViewerStateEvent";
import { ViewerResetEvent } from "../../src/viewer/events/ViewerResetEvent";

describe("Observer.ctor", () => {
    it("should be defined", () => {
        const viewer = <Viewer>new EventEmitter();

        const observer =
            new Observer(
                viewer,
                new NavigatorMockCreator().create(),
                new ContainerMockCreator().create());

        expect(observer).toBeDefined();
    });
});

describe("Observer.dataloading", () => {
    it("should emit loading when not started", (done: Function) => {
        const viewer = <Viewer>new EventEmitter();
        const navigatorMock = new NavigatorMockCreator().create();

        const observer = new Observer(
            viewer,
            navigatorMock,
            new ContainerMockCreator().create());

        expect(observer).toBeDefined();

        viewer.on(
            "dataloading",
            (event: ViewerDataLoadingEvent) => {
                expect(event.loading).toBe(true);
                done();
            });

        (<Subject<boolean>>navigatorMock.loadingService.loading$).next(true);
    });

    it("should emit loading when started", (done: Function) => {
        const viewer = <Viewer>new EventEmitter();
        const navigatorMock = new NavigatorMockCreator().create();

        const observer =
            new Observer(
                viewer,
                navigatorMock,
                new ContainerMockCreator().create());

        viewer.on(
            "dataloading",
            (event: ViewerDataLoadingEvent) => {
                expect(event.loading).toBe(true);
                done();
            });

        observer.startEmit();

        (<Subject<boolean>>navigatorMock.loadingService.loading$).next(true);
    });

    it("should emit loading when started and stopped", (done: Function) => {
        const viewer = <Viewer>new EventEmitter();
        const navigatorMock = new NavigatorMockCreator().create();

        const observer =
            new Observer(
                viewer,
                navigatorMock,
                new ContainerMockCreator().create());

        viewer.on(
            "dataloading",
            (event: ViewerDataLoadingEvent) => {
                expect(event.loading).toBe(true);
                done();
            });

        observer.startEmit();
        observer.stopEmit();

        (<Subject<boolean>>navigatorMock.loadingService.loading$).next(true);
    });
});

describe("Observer.position", () => {
    it("should emit when reference changes", (done: Function) => {
        const viewer = <Viewer>new EventEmitter();
        const navigatorMock = new NavigatorMockCreator().create();

        const observer = new Observer(
            viewer,
            navigatorMock,
            new ContainerMockCreator().create());
        observer.startEmit();

        viewer.on(
            "position",
            (event: ViewerStateEvent) => {
                expect(event.type).toBe("position");
                done();
            });

        (<Subject<LngLatAlt>>navigatorMock.stateService.reference$).next({
            lng: 0,
            lat: 1,
            alt: 2
        });
    });
});

describe("Observer.reset", () => {
    it("should emit when data has been reset", (done: Function) => {
        const viewer = <Viewer>new EventEmitter();
        const navigatorMock = new NavigatorMockCreator().create();

        const observer = new Observer(
            viewer,
            navigatorMock,
            new ContainerMockCreator().create());
        observer.startEmit();

        viewer.on(
            "reset",
            (event: ViewerResetEvent) => {
                expect(event.type).toBe("reset");
                done();
            });

        (<Subject<void>>navigatorMock.graphService.dataReset$).next(null);
    });
});
