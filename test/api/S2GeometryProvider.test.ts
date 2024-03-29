import { S2 } from "s2-geometry";
import { LngLat } from "../../src/api/interfaces/LngLat";
import { S2GeometryProvider } from "../../src/api/S2GeometryProvider";
import { MapillaryError } from "../../src/error/MapillaryError";
import * as GeoCoords from "../../src/geo/GeoCoords";
import { isClockwise } from "../helper/TestMath";

describe("S2GeometryProvider.ctor", () => {
    it("should be defined", () => {
        const geometry = new S2GeometryProvider();

        expect(geometry).toBeDefined();
    });
});

describe("GS2GeometryProvider.lngLatToCellId", () => {
    it("should call geometry correctly", () => {
        const keySpy = spyOn(S2, "latLngToKey");
        const idSpy = spyOn(S2, "keyToId");
        keySpy.and.returnValue("0/0");
        idSpy.and.returnValue("0.0");

        const level = 22;
        const geometry = new S2GeometryProvider(level);

        const lat = -1;
        const lng = 1;
        geometry.lngLatToCellId({ lat, lng });

        expect(keySpy.calls.count()).toBe(1);
        expect(keySpy.calls.first().args[0]).toBe(lat);
        expect(keySpy.calls.first().args[1]).toBe(lng);
        expect(keySpy.calls.first().args[2]).toBe(level);

        expect(idSpy.calls.count()).toBe(1);
        expect(idSpy.calls.first().args[0]).toBe("0/0");
    });
});

describe("S2GeometryProvider.bboxToCellIds", () => {
    const setupSpies: (tileSize: number) => void =
        (tileSize: number): void => {
            spyOn(S2, "latLngToKey").and.callFake(
                (lat: number, lng: number): string => {
                    return `${Math.round(lat)}/${Math.round(lng)}`;
                });

            spyOn(S2, "keyToId").and.callFake(
                (key: string): string => {
                    const [k0, k1] = key.split("/");
                    return `${k0}.${k1}`;
                });

            spyOn(S2, "idToKey").and.callFake(
                (id: string): string => {
                    const [i0, i1] = id.split(".");
                    return `${i0}/${i1}`;
                });

            spyOn(S2, "keyToLatLng").and.callFake(
                (key: string): S2.ILatLng => {
                    const [k0, k1] = key.split("/");
                    const lat = Number.parseInt(k0, 10);
                    const lng = Number.parseInt(k1, 10);

                    return { lat: lat, lng: lng };
                });

            spyOn(S2.S2Cell, "FromHilbertQuadKey").and.callFake(
                (key: string): S2.S2Cell => {
                    const [k0, k1] = key.split("/");
                    const lat = Number.parseInt(k0, 10);
                    const lng = Number.parseInt(k1, 10);

                    const s2Cell: S2.S2Cell = new S2.S2Cell();
                    spyOn(s2Cell, "getCornerLatLngs").and.returnValue([
                        { lat: lat - 0.5, lng: lng + 0.5 },
                        { lat: lat - 0.5, lng: lng - 0.5 },
                        { lat: lat + 0.5, lng: lng - 0.5 },
                        { lat: lat + 0.5, lng: lng + 0.5 },
                    ]);

                    return s2Cell;
                });

            spyOn(S2, "latLngToNeighborKeys").and.callFake(
                (lat: number, lng: number): string[] => {
                    return [
                        `${lat}/${lng - 1}`,
                        `${lat + 1}/${lng}`,
                        `${lat}/${lng + 1}`,
                        `${lat - 1}/${lng}`,
                    ];
                });

            spyOn(GeoCoords, "geodeticToEnu").and.callFake(
                (
                    lat: number,
                    lng: number,
                    _: number,
                    refLat: number,
                    refLng: number)
                    : number[] => {
                    return [
                        tileSize * (lng - refLng),
                        tileSize * (lat - refLat),
                        0];
                });

            spyOn(GeoCoords, "enuToGeodetic").and.callFake(
                (x: number, y: number, _: number, refLat: number, refLng: number): number[] => {
                    return [
                        refLng + x / tileSize,
                        refLat + y / tileSize,
                        0];
                });
        };

    it("should return cell", () => {
        const geometry = new S2GeometryProvider();
        const tileSize = 1;
        setupSpies(tileSize);

        const sw: LngLat = { lat: -0.1, lng: -0.1 };
        const ne: LngLat = { lat: 0.1, lng: 0.1 };
        const cellIds = geometry.bboxToCellIds(sw, ne);

        expect(cellIds.length).toBe(1);
        expect(cellIds[0]).toBe("0.0");
    });

    it("should return cell and adjacent", () => {
        const geometry = new S2GeometryProvider();
        const tileSize = 1;
        setupSpies(tileSize);

        const sw: LngLat = { lat: -0.6, lng: -0.6 };
        const ne: LngLat = { lat: 0.6, lng: 0.6 };
        const cellIds = geometry.bboxToCellIds(sw, ne);

        expect(cellIds.length).toBe(9);
        expect(cellIds.indexOf("0.0")).not.toBe(-1);
        expect(cellIds.indexOf("0.1")).not.toBe(-1);
        expect(cellIds.indexOf("-1.1")).not.toBe(-1);
        expect(cellIds.indexOf("-1.0")).not.toBe(-1);
        expect(cellIds.indexOf("-1.-1")).not.toBe(-1);
        expect(cellIds.indexOf("0.-1")).not.toBe(-1);
        expect(cellIds.indexOf("1.-1")).not.toBe(-1);
        expect(cellIds.indexOf("1.0")).not.toBe(-1);
        expect(cellIds.indexOf("1.1")).not.toBe(-1);
    });

    describe("S2GeometryProvider.bboxToCellIds", () => {
        it("should throw if north east is not larger than south west", () => {
            const geometry = new S2GeometryProvider();

            expect(() => {
                geometry
                    .bboxToCellIds(
                        { lat: 0, lng: 0 },
                        { lat: -1, lng: 1 });
            }).toThrowError(MapillaryError);

            expect(() => {
                geometry
                    .bboxToCellIds(
                        { lat: 0, lng: 0 },
                        { lat: 1, lng: -1 });
            }).toThrowError(MapillaryError);

            expect(() => {
                geometry.bboxToCellIds(
                    { lat: 0, lng: 0 },
                    { lat: -1, lng: -1 });
            }).toThrowError(MapillaryError);
        });
    });

    describe("S2GeometryProvider.getVertices", () => {
        it("should be correctly placed relative to each other", () => {
            const geometry = new S2GeometryProvider();

            const lngLats: LngLat[] = [
                { lat: 0, lng: 0 },
                { lat: 45, lng: 0 },
                { lat: 0, lng: 45 },
                { lat: -45, lng: 0 },
                { lat: 0, lng: -45 },
                { lat: 45, lng: 45 },
                { lat: -45, lng: -45 },
                { lat: 45, lng: -45 },
                { lat: -45, lng: 45 },
                { lat: -45, lng: 135 },
            ];

            for (let lngLat of lngLats) {
                const cellId = geometry.lngLatToCellId(lngLat);
                const vertices = geometry.getVertices(cellId);
                expect(vertices.length).toBe(4);

                const polygon = vertices
                    .map(
                        (ll: LngLat): number[] => {
                            return [ll.lng, ll.lat];
                        });

                expect(isClockwise(polygon)).toBe(true);
            }
        });
    });

    describe("S2GeometryProvider.getAdjacent", () => {
        it("should always be 8", () => {
            const geometry = new S2GeometryProvider();

            const lngLats: LngLat[] = [
                { lat: 0, lng: 0 },
                { lat: 45, lng: 0 },
                { lat: 0, lng: 45 },
                { lat: -45, lng: 0 },
                { lat: 0, lng: -45 },
                { lat: 45, lng: 45 },
                { lat: -45, lng: -45 },
                { lat: 45, lng: -45 },
                { lat: -45, lng: 45 },
                { lat: -45, lng: 135 },
                { lat: -45, lng: 180 },
                { lat: 0, lng: 180 },
                { lat: 45, lng: 180 },
            ];

            for (let lngLat of lngLats) {
                const cellId = geometry.lngLatToCellId(lngLat);
                const adjacent = geometry.getAdjacent(cellId);
                expect(adjacent.length).toBe(8);
            }
        });
    });
});
