import * as THREE from "three";
import { ICamera } from "../geometry/interfaces/ICamera";
import { isSpherical } from "./Geo";
import { CameraType } from "./interfaces/CameraType";


/**
 * @class Transform
 *
 * @classdesc Class used for calculating coordinate transformations
 * and projections.
 */
export class Transform {
    private _width: number;
    private _height: number;
    private _focal: number;
    private _orientation: number;
    private _scale: number;
    private _basicWidth: number;
    private _basicHeight: number;
    private _basicAspect: number;

    private _worldToCamera: THREE.Matrix4;
    private _worldToCameraInverse: THREE.Matrix4;
    private _scaledWorldToCamera: THREE.Matrix4;
    private _scaledWorldToCameraInverse: THREE.Matrix4;
    private _basicWorldToCamera: THREE.Matrix4;

    /**
     * Create a new transform instance.
     * @param {number} orientation - Image orientation.
     * @param {number} width - Image height.
     * @param {number} height - Image width.
     * @param {number} focal - Focal length.
     * @param {number} scale - Atomic scale.
     * @param {Array<number>} rotation - Rotation vector in three dimensions.
     * @param {Array<number>} translation - Translation vector in three dimensions.
     * @param {HTMLImageElement} image - Image for fallback size calculations.
     */
    constructor(
        orientation: number,
        width: number,
        height: number,
        scale: number,
        rotation: number[],
        translation: number[],
        image: HTMLImageElement,
        public readonly camera: ICamera) {

        this._orientation = this._getValue(orientation, 1);

        let imageWidth = image != null ? image.width : 4;
        let imageHeight = image != null ? image.height : 3;
        let keepOrientation = this._orientation < 5;

        this._width = this._getValue(width, keepOrientation ? imageWidth : imageHeight);
        this._height = this._getValue(height, keepOrientation ? imageHeight : imageWidth);

        this._basicAspect = keepOrientation ?
            this._width / this._height :
            this._height / this._width;

        this._basicWidth = keepOrientation ? width : height;
        this._basicHeight = keepOrientation ? height : width;

        this._focal = this._getValue(camera.parameters.focal, 1);
        this._scale = this._getValue(scale, 0);

        this._worldToCamera = this.createWorldToCamera(rotation, translation);
        this._worldToCameraInverse = new THREE.Matrix4()
            .copy(this._worldToCamera)
            .invert();
        this._scaledWorldToCamera =
            this._createScaledWorldToCamera(this._worldToCamera, this._scale);
        this._scaledWorldToCameraInverse = new THREE.Matrix4()
            .copy(this._scaledWorldToCamera)
            .invert();

        this._basicWorldToCamera = this._createBasicWorldToCamera(
            this._worldToCamera,
            orientation);
    }

    public get cameraType(): CameraType {
        return <CameraType>this.camera.type;
    }

    /**
     * Get basic aspect.
     * @returns {number} The orientation adjusted aspect ratio.
     */
    public get basicAspect(): number {
        return this._basicAspect;
    }

    /**
     * Get basic height.
     *
     * @description Does not fall back to image image height but
     * uses original value from API so can be faulty.
     *
     * @returns {number} The height of the basic version image
     * (adjusted for orientation).
     */
    public get basicHeight(): number {
        return this._basicHeight;
    }

    public get basicRt(): THREE.Matrix4 {
        return this._basicWorldToCamera;
    }

    /**
     * Get basic width.
     *
     * @description Does not fall back to image image width but
     * uses original value from API so can be faulty.
     *
     * @returns {number} The width of the basic version image
     * (adjusted for orientation).
     */
    public get basicWidth(): number {
        return this._basicWidth;
    }

    /**
     * Get focal.
     * @returns {number} The image focal length.
     */
    public get focal(): number {
        return this._focal;
    }

    /**
     * Get height.
     *
     * @description Falls back to the image image height if
     * the API data is faulty.
     *
     * @returns {number} The orientation adjusted image height.
     */
    public get height(): number {
        return this._height;
    }

    /**
     * Get orientation.
     * @returns {number} The image orientation.
     */
    public get orientation(): number {
        return this._orientation;
    }

    /**
     * Get rt.
     * @returns {THREE.Matrix4} The extrinsic camera matrix.
     */
    public get rt(): THREE.Matrix4 {
        return this._worldToCamera;
    }

    /**
     * Get rtInverse.
     * @returns {THREE.Matrix4} The inverse of the extrinsic camera matrix.
     */
    public get rtInverse(): THREE.Matrix4 {
        return this._worldToCameraInverse;
    }

    /**
     * Get srt.
     * @returns {THREE.Matrix4} The scaled extrinsic camera matrix.
     */
    public get srt(): THREE.Matrix4 {
        return this._scaledWorldToCamera;
    }

    /**
     * Get srtInverse.
     * @returns {THREE.Matrix4} The scaled extrinsic camera matrix.
     */
    public get srtInverse(): THREE.Matrix4 {
        return this._scaledWorldToCameraInverse;
    }

    /**
     * Get scale.
     * @returns {number} The image atomic reconstruction scale.
     */
    public get scale(): number {
        return this._scale;
    }

    /**
     * Get has valid scale.
     * @returns {boolean} Value indicating if the scale of the transform is valid.
     */
    public get hasValidScale(): boolean {
        return this._scale > 1e-2 && this._scale < 50;
    }

    /**
     * Get width.
     *
     * @description Falls back to the image image width if
     * the API data is faulty.
     *
     * @returns {number} The orientation adjusted image width.
     */
    public get width(): number {
        return this._width;
    }

    /**
     * Calculate the up vector for the image transform.
     *
     * @returns {THREE.Vector3} Normalized and orientation adjusted up vector.
     */
    public upVector(): THREE.Vector3 {
        let rte: number[] = this._worldToCamera.elements;

        switch (this._orientation) {
            case 1:
                return new THREE.Vector3(-rte[1], -rte[5], -rte[9]);
            case 3:
                return new THREE.Vector3(rte[1], rte[5], rte[9]);
            case 6:
                return new THREE.Vector3(-rte[0], -rte[4], -rte[8]);
            case 8:
                return new THREE.Vector3(rte[0], rte[4], rte[8]);
            default:
                return new THREE.Vector3(-rte[1], -rte[5], -rte[9]);
        }
    }

    /**
     * Project 3D world coordinates to basic coordinates.
     *
     * @param {Array<number>} point3d - 3D world coordinates.
     * @return {Array<number>} 2D basic coordinates.
     */
    public projectBasic(point3d: number[]): number[] {
        let sfm: number[] = this.projectSfM(point3d);
        return this._sfmToBasic(sfm);
    }

    /**
     * Unproject basic coordinates to 3D world coordinates.
     *
     * @param {Array<number>} basic - 2D basic coordinates.
     * @param {Array<number>} distance - Distance to unproject from camera center.
     * @param {boolean} [depth] - Treat the distance value as depth from camera center.
     *                            Only applicable for perspective images. Will be
     *                            ignored for spherical.
     * @returns {Array<number>} Unprojected 3D world coordinates.
     */
    public unprojectBasic(basic: number[], distance: number, depth?: boolean): number[] {
        let sfm: number[] = this._basicToSfm(basic);
        return this.unprojectSfM(sfm, distance, depth);
    }

    /**
     * Project 3D world coordinates to SfM coordinates.
     *
     * @param {Array<number>} point3d - 3D world coordinates.
     * @return {Array<number>} 2D SfM coordinates.
     */
    public projectSfM(point3d: number[]): number[] {
        let v: THREE.Vector4 = new THREE.Vector4(point3d[0], point3d[1], point3d[2], 1);
        v.applyMatrix4(this._worldToCamera);
        return this._bearingToSfm([v.x, v.y, v.z]);
    }

    /**
     * Unproject SfM coordinates to a 3D world coordinates.
     *
     * @param {Array<number>} sfm - 2D SfM coordinates.
     * @param {Array<number>} distance - Distance to unproject
     * from camera center.
     * @param {boolean} [depth] - Treat the distance value as
     * depth from camera center. Only applicable for perspective
     * images. Will be ignored for spherical.
     * @returns {Array<number>} Unprojected 3D world coordinates.
     */
    public unprojectSfM(
        sfm: number[],
        distance: number,
        depth?: boolean): number[] {
        const bearing = this._sfmToBearing(sfm);
        const unprojectedCamera = depth && !isSpherical(this.camera.type) ?
            new THREE.Vector4(
                distance * bearing[0] / bearing[2],
                distance * bearing[1] / bearing[2],
                distance,
                1) :
            new THREE.Vector4(
                distance * bearing[0],
                distance * bearing[1],
                distance * bearing[2],
                1);

        const unprojectedWorld = unprojectedCamera
            .applyMatrix4(this._worldToCameraInverse);
        return [
            unprojectedWorld.x / unprojectedWorld.w,
            unprojectedWorld.y / unprojectedWorld.w,
            unprojectedWorld.z / unprojectedWorld.w,
        ];
    }

    /**
     * Transform SfM coordinates to bearing vector (3D cartesian
     * coordinates on the unit sphere).
     *
     * @param {Array<number>} sfm - 2D SfM coordinates.
     * @returns {Array<number>} Bearing vector (3D cartesian coordinates
     * on the unit sphere).
     */
    private _sfmToBearing(sfm: number[]): number[] {
        return this.camera.bearingFromSfm(sfm);
    }

    /**
     * Transform bearing vector (3D cartesian coordiantes on the unit sphere) to
     * SfM coordinates.
     *
     * @param {Array<number>} bearing - Bearing vector (3D cartesian coordinates on the
     * unit sphere).
     * @returns {Array<number>} 2D SfM coordinates.
     */
    private _bearingToSfm(bearing: number[]): number[] {
        return this.camera.projectToSfm(bearing);
    }

    /**
     * Convert basic coordinates to SfM coordinates.
     *
     * @param {Array<number>} basic - 2D basic coordinates.
     * @returns {Array<number>} 2D SfM coordinates.
     */
    private _basicToSfm(basic: number[]): number[] {
        let rotatedX: number;
        let rotatedY: number;

        switch (this._orientation) {
            case 1:
                rotatedX = basic[0];
                rotatedY = basic[1];
                break;
            case 3:
                rotatedX = 1 - basic[0];
                rotatedY = 1 - basic[1];
                break;
            case 6:
                rotatedX = basic[1];
                rotatedY = 1 - basic[0];
                break;
            case 8:
                rotatedX = 1 - basic[1];
                rotatedY = basic[0];
                break;
            default:
                rotatedX = basic[0];
                rotatedY = basic[1];
                break;
        }

        let w: number = this._width;
        let h: number = this._height;
        let s: number = Math.max(w, h);
        let sfmX: number = rotatedX * w / s - w / s / 2;
        let sfmY: number = rotatedY * h / s - h / s / 2;

        return [sfmX, sfmY];
    }

    /**
     * Convert SfM coordinates to basic coordinates.
     *
     * @param {Array<number>} sfm - 2D SfM coordinates.
     * @returns {Array<number>} 2D basic coordinates.
     */
    private _sfmToBasic(sfm: number[]): number[] {
        let w: number = this._width;
        let h: number = this._height;
        let s: number = Math.max(w, h);
        let rotatedX: number = (sfm[0] + w / s / 2) / w * s;
        let rotatedY: number = (sfm[1] + h / s / 2) / h * s;

        let basicX: number;
        let basicY: number;

        switch (this._orientation) {
            case 1:
                basicX = rotatedX;
                basicY = rotatedY;
                break;
            case 3:
                basicX = 1 - rotatedX;
                basicY = 1 - rotatedY;
                break;
            case 6:
                basicX = 1 - rotatedY;
                basicY = rotatedX;
                break;
            case 8:
                basicX = rotatedY;
                basicY = 1 - rotatedX;
                break;
            default:
                basicX = rotatedX;
                basicY = rotatedY;
                break;
        }

        return [basicX, basicY];
    }

    /**
     * Checks a value and returns it if it exists and is larger than 0.
     * Fallbacks if it is null.
     *
     * @param {number} value - Value to check.
     * @param {number} fallback - Value to fall back to.
     * @returns {number} The value or its fallback value if it is not defined or negative.
     */
    private _getValue(value: number, fallback: number): number {
        return value != null && value > 0 ? value : fallback;
    }

    private _getCameraParameters(
        value: number[],
        cameraType: string): number[] {
        if (isSpherical(cameraType)) { return []; }
        if (!value || value.length === 0) { return [1, 0, 0]; }

        const padding = 3 - value.length;
        if (padding <= 0) { return value; }

        return value
            .concat(
                new Array(padding)
                    .fill(0));
    }

    /**
     * Creates the extrinsic camera matrix [ R | t ].
     *
     * @param {Array<number>} rotation - Rotation vector in angle axis representation.
     * @param {Array<number>} translation - Translation vector.
     * @returns {THREE.Matrix4} Extrisic camera matrix.
     */
    private createWorldToCamera(
        rotation: number[],
        translation: number[]): THREE.Matrix4 {
        const axis = new THREE.Vector3(rotation[0], rotation[1], rotation[2]);
        const angle = axis.length();
        if (angle > 0) {
            axis.normalize();
        }

        const worldToCamera = new THREE.Matrix4();
        worldToCamera.makeRotationAxis(axis, angle);
        worldToCamera.setPosition(
            new THREE.Vector3(
                translation[0],
                translation[1],
                translation[2]));

        return worldToCamera;
    }

    /**
     * Calculates the scaled extrinsic camera matrix scale * [ R | t ].
     *
     * @param {THREE.Matrix4} worldToCamera - Extrisic camera matrix.
     * @param {number} scale - Scale factor.
     * @returns {THREE.Matrix4} Scaled extrisic camera matrix.
     */
    private _createScaledWorldToCamera(
        worldToCamera: THREE.Matrix4,
        scale: number): THREE.Matrix4 {
        const scaledWorldToCamera = worldToCamera.clone();
        const elements = scaledWorldToCamera.elements;
        elements[12] = scale * elements[12];
        elements[13] = scale * elements[13];
        elements[14] = scale * elements[14];
        scaledWorldToCamera.scale(new THREE.Vector3(scale, scale, scale));
        return scaledWorldToCamera;
    }

    private _createBasicWorldToCamera(rt: THREE.Matrix4, orientation: number): THREE.Matrix4 {
        const axis: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
        let angle: number = 0;

        switch (orientation) {
            case 3:
                angle = Math.PI;
                break;
            case 6:
                angle = Math.PI / 2;
                break;
            case 8:
                angle = 3 * Math.PI / 2;
                break;
            default:
                break;
        }

        return new THREE.Matrix4()
            .makeRotationAxis(axis, angle)
            .multiply(rt);
    }

    /**
     * Calculate a transformation matrix from normalized coordinates for
     * texture map coordinates.
     *
     * @returns {THREE.Matrix4} Normalized coordinates to texture map
     * coordinates transformation matrix.
     */
    private _normalizedToTextureMatrix(): THREE.Matrix4 {
        const size = Math.max(this._width, this._height);
        const w = size / this._width;
        const h = size / this._height;

        switch (this._orientation) {
            case 1:
                return new THREE.Matrix4().set(w, 0, 0, 0.5, 0, -h, 0, 0.5, 0, 0, 1, 0, 0, 0, 0, 1);
            case 3:
                return new THREE.Matrix4().set(-w, 0, 0, 0.5, 0, h, 0, 0.5, 0, 0, 1, 0, 0, 0, 0, 1);
            case 6:
                return new THREE.Matrix4().set(0, -h, 0, 0.5, -w, 0, 0, 0.5, 0, 0, 1, 0, 0, 0, 0, 1);
            case 8:
                return new THREE.Matrix4().set(0, h, 0, 0.5, w, 0, 0, 0.5, 0, 0, 1, 0, 0, 0, 0, 1);
            default:
                return new THREE.Matrix4().set(w, 0, 0, 0.5, 0, -h, 0, 0.5, 0, 0, 1, 0, 0, 0, 0, 1);
        }
    }
}
