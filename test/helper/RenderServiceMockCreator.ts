import { Subject } from "rxjs";
import { RenderCamera } from "../../src/render/RenderCamera";
import { RenderService } from "../../src/render/RenderService";

import { MockCreator } from "./MockCreator";
import { MockCreatorBase } from "./MockCreatorBase";

export class RenderServiceMockCreator extends MockCreatorBase<RenderService> {
    public create(): RenderService {
        const mock: RenderService = new MockCreator().create(RenderService, "RenderService");

        this._mockProperty(mock, "bearing$", new Subject<RenderCamera>());
        this._mockProperty(mock, "projectionMatrix$", new Subject<number[]>());
        this._mockProperty(mock, "renderCamera$", new Subject<RenderCamera>());
        this._mockProperty(mock, "renderCameraFrame$", new Subject<RenderCamera>());
        this._mockProperty(mock, "size$", new Subject<RenderCamera>());

        return mock;
    }
}
