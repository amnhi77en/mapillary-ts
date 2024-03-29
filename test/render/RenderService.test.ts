import { empty as observableEmpty, Subject } from "rxjs";

import { skip, first, take, count } from "rxjs/operators";
import { PerspectiveCamera } from "three";
import { Camera } from "../../src/geo/Camera";
import { ViewportSize } from "../../src/render/interfaces/ViewportSize";
import { RenderCamera } from "../../src/render/RenderCamera";
import { RenderMode } from "../../src/render/RenderMode";
import { RenderService } from "../../src/render/RenderService";
import { AnimationFrame } from "../../src/state/interfaces/AnimationFrame";
import { FrameHelper } from "../helper/FrameHelper";

const createFrame: (frameId: number, alpha?: number, camera?: Camera) => AnimationFrame =
    (frameId: number, alpha?: number, camera?: Camera): AnimationFrame => {
        const frame: AnimationFrame = new FrameHelper().createFrame();

        frame.id = frameId;
        frame.state.alpha = alpha != null ? alpha : 0;
        frame.state.camera = camera != null ? camera : new Camera();
        frame.state.currentCamera = camera != null ? camera : new Camera();

        return frame;
    };

describe("RenderService.ctor", () => {
    it("should be contructed", () => {
        let element: HTMLDivElement = document.createElement("div");
        let renderService: RenderService =
            new RenderService(element, observableEmpty(), RenderMode.Letterbox);

        expect(renderService).toBeDefined();
    });
});

describe("RenderService.renderMode", () => {
    it("should default to fill", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let renderService: RenderService =
            new RenderService(element, observableEmpty(), null);

        renderService.renderMode$.pipe(
            first())
            .subscribe(
                (renderMode: RenderMode): void => {
                    expect(renderMode).toBe(RenderMode.Fill);

                    done();
                });
    });

    it("should set initial render mode to constructor parameter", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let renderService: RenderService =
            new RenderService(element, observableEmpty(), RenderMode.Letterbox);

        renderService.renderMode$.pipe(
            first())
            .subscribe(
                (renderMode: RenderMode): void => {
                    expect(renderMode).toBe(RenderMode.Letterbox);

                    done();
                });
    });

    it("should return latest render mode on subscripion", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let renderService: RenderService =
            new RenderService(element, observableEmpty(), RenderMode.Letterbox);

        renderService.renderMode$.next(RenderMode.Fill);

        renderService.renderMode$.pipe(
            first())
            .subscribe(
                (renderMode: RenderMode): void => {
                    expect(renderMode).toBe(RenderMode.Fill);

                    done();
                });
    });
});

describe("RenderService.size", () => {
    it("should be defined", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let renderService: RenderService =
            new RenderService(element, observableEmpty(), RenderMode.Letterbox);

        renderService.size$.pipe(
            first())
            .subscribe(
                (size: ViewportSize): void => {
                    expect(size).toBeDefined();

                    done();
                });
    });

    it("should have an initial value", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let renderService: RenderService =
            new RenderService(element, observableEmpty(), RenderMode.Letterbox);

        renderService.size$.pipe(
            first())
            .subscribe(
                (size: ViewportSize): void => {
                    expect(size.width).toBe(0);
                    expect(size.height).toBe(0);

                    done();
                });
    });

    it("should emit new value on resize", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let renderService: RenderService =
            new RenderService(element, observableEmpty(), RenderMode.Letterbox);

        renderService.size$.pipe(
            take(2))
            .subscribe(
                (size: ViewportSize): void => { return; },
                (e: Error): void => { return; },
                (): void => { done(); });

        renderService.resize$.next();
    });
});

describe("RenderService.renderCameraFrame", () => {
    const createRenderCameraMock: () => RenderCamera = (): RenderCamera => {
        const renderCamera: RenderCamera = new RenderCamera(1, 1, RenderMode.Fill);

        return renderCamera;
    };

    it("should be defined", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let frame$: Subject<AnimationFrame> = new Subject<AnimationFrame>();
        const renderCamera: RenderCamera = createRenderCameraMock();

        let renderService: RenderService = new RenderService(element, frame$, RenderMode.Letterbox, renderCamera);

        renderService.renderCameraFrame$.pipe(
            first())
            .subscribe(
                (rc: RenderCamera): void => {
                    expect(rc).toBeDefined();

                    done();
                });

        frame$.next(createFrame(0));
        frame$.complete();
    });

    it("should be changed for first frame", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let frame$: Subject<AnimationFrame> = new Subject<AnimationFrame>();
        const renderCamera: RenderCamera = createRenderCameraMock();

        let renderService: RenderService = new RenderService(element, frame$, RenderMode.Letterbox, renderCamera);

        renderService.renderCameraFrame$.pipe(
            first())
            .subscribe(
                (rc: RenderCamera): void => {
                    expect(rc.changed).toBe(true);

                    done();
                });

        frame$.next(createFrame(0));
        frame$.complete();
    });

    it("should not be changed for two identical frames", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let frame$: Subject<AnimationFrame> = new Subject<AnimationFrame>();
        const renderCamera: RenderCamera = createRenderCameraMock();

        let renderService: RenderService = new RenderService(element, frame$, RenderMode.Letterbox, renderCamera);

        renderService.renderCameraFrame$.pipe(
            skip(1),
            first())
            .subscribe(
                (rc: RenderCamera): void => {
                    expect(rc.changed).toBe(false);

                    done();
                });

        frame$.next(createFrame(0));
        frame$.next(createFrame(1));
        frame$.complete();
    });

    it("should be changed for alpha changes between two frames", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let frame$: Subject<AnimationFrame> = new Subject<AnimationFrame>();
        const renderCamera: RenderCamera = createRenderCameraMock();

        let renderService: RenderService = new RenderService(element, frame$, RenderMode.Letterbox, renderCamera);

        renderService.renderCameraFrame$.pipe(
            skip(1),
            first())
            .subscribe(
                (rc: RenderCamera): void => {
                    expect(rc.changed).toBe(true);

                    done();
                });

        frame$.next(createFrame(0, 0.00));
        frame$.next(createFrame(1, 0.01));
        frame$.complete();
    });

    it("should be changed for camera changes between two frames", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let frame$: Subject<AnimationFrame> = new Subject<AnimationFrame>();
        const renderCamera: RenderCamera = createRenderCameraMock();

        let renderService: RenderService = new RenderService(element, frame$, RenderMode.Letterbox, renderCamera);

        renderService.renderCameraFrame$.pipe(
            skip(1),
            first())
            .subscribe(
                (rc: RenderCamera): void => {
                    expect(rc.changed).toBe(true);

                    done();
                });

        let camera: Camera = new Camera();
        frame$.next(createFrame(0, 0, camera));

        camera.position.x = 0.01;
        frame$.next(createFrame(1, 0, camera));
        frame$.complete();
    });

    it("should be changed for resize", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let frame$: Subject<AnimationFrame> = new Subject<AnimationFrame>();
        const renderCamera: RenderCamera = createRenderCameraMock();

        let renderService: RenderService = new RenderService(element, frame$, RenderMode.Letterbox, renderCamera);

        renderService.renderCameraFrame$.pipe(
            skip(1),
            first())
            .subscribe(
                (rc: RenderCamera): void => {
                    expect(rc.changed).toBe(true);

                    done();
                });

        frame$.next(createFrame(0));

        renderService.resize$.next();
        frame$.next(createFrame(1));
        frame$.complete();
    });

    it("should be changed for changed render mode", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let frame$: Subject<AnimationFrame> = new Subject<AnimationFrame>();
        const renderCamera: RenderCamera = createRenderCameraMock();

        let renderService: RenderService = new RenderService(element, frame$, RenderMode.Letterbox, renderCamera);

        renderService.renderCameraFrame$.pipe(
            skip(1),
            first())
            .subscribe(
                (rc: RenderCamera): void => {
                    expect(rc.changed).toBe(true);

                    done();
                });

        frame$.next(createFrame(0));

        renderService.renderMode$.next(RenderMode.Fill);
        frame$.next(createFrame(1));
        frame$.complete();
    });

    it("should have correct render mode when changed before subscribe", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let frame$: Subject<AnimationFrame> = new Subject<AnimationFrame>();
        const renderCamera: RenderCamera = createRenderCameraMock();

        let renderService: RenderService = new RenderService(element, frame$, RenderMode.Letterbox, renderCamera);

        renderService.renderMode$.next(RenderMode.Fill);

        renderService.renderCameraFrame$.pipe(
            first())
            .subscribe(
                (rc: RenderCamera): void => {
                    expect(rc.renderMode).toBe(RenderMode.Fill);

                    done();
                });

        frame$.next(createFrame(0));
        frame$.complete();
    });

    it("should emit once for each frame", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let frame$: Subject<AnimationFrame> = new Subject<AnimationFrame>();
        const renderCamera: RenderCamera = createRenderCameraMock();

        let renderService: RenderService = new RenderService(element, frame$, RenderMode.Letterbox, renderCamera);

        renderService.renderCameraFrame$.pipe(
            count())
            .subscribe(
                (emitCount: number): void => {
                    expect(emitCount).toBe(4);

                    done();
                });

        frame$.next(createFrame(0));
        frame$.next(createFrame(1));

        renderService.renderMode$.next(RenderMode.Fill);
        renderService.resize$.next();

        frame$.next(createFrame(2));
        frame$.next(createFrame(3));
        frame$.complete();
    });
});

describe("RenderService.renderCamera$", () => {
    it("should be defined", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let frame$: Subject<AnimationFrame> = new Subject<AnimationFrame>();

        const renderCamera: RenderCamera = new RenderCamera(1, 1, RenderMode.Fill);

        let renderService: RenderService = new RenderService(element, frame$, RenderMode.Letterbox, renderCamera);

        renderService.renderCamera$.pipe(
            first())
            .subscribe(
                (rc: RenderCamera): void => {
                    expect(rc).toBeDefined();

                    done();
                });

        frame$.next(createFrame(0));
        frame$.complete();
    });

    it("should only emit when camera has changed", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let frame$: Subject<AnimationFrame> = new Subject<AnimationFrame>();

        const renderCamera: RenderCamera = new RenderCamera(1, 1, RenderMode.Fill);

        let renderService: RenderService = new RenderService(element, frame$, RenderMode.Letterbox, renderCamera);

        renderService.renderCamera$.pipe(
            skip(1),
            first())
            .subscribe(
                (rc: RenderCamera): void => {
                    expect(rc.frameId).toBe(2);

                    done();
                });

        frame$.next(createFrame(0));
        frame$.next(createFrame(1));
        frame$.next(createFrame(2, 0.5));
        frame$.complete();
    });

    it("should check width and height only once on resize", () => {
        let element: any = {
            get offsetHeight(): number {
                return this.getOffsetHeight();
            },
            getOffsetHeight(): number {
                return 0;
            },
            get offsetWidth(): number {
                return this.getOffsetWidth();
            },
            getOffsetWidth(): number {
                return 0;
            },
            appendChild(htmlElement: HTMLElement): void { return; },
        };

        let frame$: Subject<AnimationFrame> = new Subject<AnimationFrame>();

        let renderService: RenderService = new RenderService(element, frame$, RenderMode.Letterbox);

        renderService.size$.subscribe(() => { /*noop*/ });
        renderService.size$.subscribe(() => { /*noop*/ });

        spyOn(element, "getOffsetHeight");
        spyOn(element, "getOffsetWidth");

        renderService.resize$.next();

        expect((<jasmine.Spy>element.getOffsetHeight).calls.count()).toBe(1);
        expect((<jasmine.Spy>element.getOffsetWidth).calls.count()).toBe(1);
    });
});

describe("RenderService.bearing$", () => {
    it("should be defined", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let frame$: Subject<AnimationFrame> = new Subject<AnimationFrame>();

        const renderCamera: RenderCamera = new RenderCamera(1, 1, RenderMode.Fill);

        let renderService: RenderService = new RenderService(element, frame$, RenderMode.Letterbox, renderCamera);

        renderService.bearing$.pipe(
            first())
            .subscribe(
                (bearing: number): void => {
                    expect(bearing).toBeDefined();

                    done();
                });

        frame$.next(createFrame(0));
    });

    it("should be 90 degrees", (done: Function) => {
        let element: HTMLDivElement = document.createElement("div");
        let frame$: Subject<AnimationFrame> = new Subject<AnimationFrame>();

        const renderCamera: RenderCamera = new RenderCamera(1, 1, RenderMode.Fill);

        let renderService: RenderService = new RenderService(element, frame$, RenderMode.Letterbox, renderCamera);

        renderService.bearing$.pipe(
            first())
            .subscribe(
                (bearing: number): void => {
                    expect(bearing).toBeCloseTo(90, 5);

                    done();
                });

        let frame: AnimationFrame = createFrame(0);
        frame.state.camera.lookat.set(1, 0, 0);

        frame$.next(frame);
    });
});

describe("RenderService.projectionMatrix$", () => {
    it("should set projection on render camera", () => {
        const element = document.createElement("div");
        const camera = new RenderCamera(1, 1, RenderMode.Letterbox);
        const renderService =
            new RenderService(
                element,
                observableEmpty(),
                RenderMode.Letterbox,
                camera);

        const projectionMatrix = new PerspectiveCamera(30, 3, 0.1, 1000)
            .projectionMatrix
            .toArray();

        renderService.projectionMatrix$.next(projectionMatrix);

        expect(camera.perspective.projectionMatrix.toArray())
            .toEqual(projectionMatrix);
    });
});
