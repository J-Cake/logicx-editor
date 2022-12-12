export default class Vector {
    constructor(public readonly point: Point) {
    }

    mag() {
        return Math.hypot(this.point.x, this.point.y);
    }

    sub(vec: Vector | Point): Vector {
        if (vec instanceof Vector)
            return new Point(vec.point.x - this.point.x, vec.point.y - this.point.y)
                .toVec();
        else
            return vec.sub(this.point).toVec();
    }

    angleBetween(vec: Vector): number {
        return vec.heading() - this.heading();
    }

    heading(): number {
        return Math.atan(this.point.y / this.point.x);
    }

    dist(point: Point): number {
        return Math.hypot(this.point.x, this.point.y);
    }
}

export class Point {
    constructor(public readonly x: number, public readonly y: number) {
    }

    toVec(): Vector {
        return new Vector(this);
    }

    sub(point: Point): Point {
        return new Point(point.x - this.x, point.y - this.y);
    }

    toTuple(): [x: number, x: number] {
        return [this.x, this.y];
    }

    snap(interval: number): Point {
        return new Point(
            Math.floor(this.x / interval) * interval,
            Math.floor(this.y / interval) * interval);
    }
}

// export function intersection(point: Point, radius: number): boolean {
//     const a = createVector(lineStart[0], lineStart[1]);
//     const b = createVector(lineEnd[0], lineEnd[1]);
//
//     const c = createVector(mouse[0], mouse[1]);
//
//     const l = p5.Vector.sub(a, b).mag();
//
//     if (a.dist(c) > l + radius / 2 || b.dist(c) > l + radius / 2)
//         return false;
//
//     const ab = p5.Vector.sub(a, b);
//     const bc = p5.Vector.sub(b, c);
//
//     return Math.abs(Math.sin(ab.angleBetween(bc))) * bc.mag() <= radius / 2;
// }

export function intersection(line: [Point, Point], mouse: Point, radius: number): boolean {
    const a = line[0].toVec();
    const b = line[1].toVec();

    const l = b.sub(a).mag();

    if (a.dist(mouse) > l + radius / 2 || b.dist(mouse) > l + radius / 2)
        return false;

    return Math.abs(Math.sin(b.sub(a).angleBetween(mouse.toVec().sub(b)))) <= radius / 2;
}