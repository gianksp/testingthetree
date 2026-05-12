import { useRef, useCallback } from "react";
import type { Transform } from "../utils/types";

interface UseCanvasPanProps {
    setTransform: React.Dispatch<React.SetStateAction<Transform>>;
    canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function useCanvasPan({ setTransform, canvasRef }: UseCanvasPanProps) {
    const dragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const lastPinchDist = useRef<number | null>(null);
    const touchStartPos = useRef({ x: 0, y: 0 });
    const touchMoved = useRef(false);

    const onWheel = useCallback(
        (e: React.WheelEvent) => {
            e.preventDefault();
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;
            const factor = e.deltaY < 0 ? 1.1 : 0.9;

            setTransform((t) => {
                const ns = Math.min(4, Math.max(0.1, t.scale * factor));
                return {
                    scale: ns,
                    x: cx - (cx - t.x) * (ns / t.scale),
                    y: cy - (cy - t.y) * (ns / t.scale),
                };
            });
        },
        [canvasRef, setTransform]
    );

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button !== 0) return;
        dragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
    }, []);

    const onMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!dragging.current) return;
            const dx = e.clientX - lastPos.current.x;
            const dy = e.clientY - lastPos.current.y;
            lastPos.current = { x: e.clientX, y: e.clientY };
            setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
        },
        [setTransform]
    );

    const onMouseUp = useCallback(() => {
        dragging.current = false;
    }, []);

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            const t = e.touches[0];
            lastPos.current = { x: t.clientX, y: t.clientY };
            touchStartPos.current = { x: t.clientX, y: t.clientY };
            touchMoved.current = false;
            dragging.current = true;
        } else if (e.touches.length === 2) {
            dragging.current = false;
            lastPinchDist.current = Math.hypot(
                e.touches[1].clientX - e.touches[0].clientX,
                e.touches[1].clientY - e.touches[0].clientY
            );
        }
    }, []);

    const onTouchMove = useCallback(
        (e: React.TouchEvent) => {
            e.preventDefault();

            if (e.touches.length === 1 && dragging.current) {
                const t = e.touches[0];
                const dx = t.clientX - lastPos.current.x;
                const dy = t.clientY - lastPos.current.y;

                if (
                    Math.abs(t.clientX - touchStartPos.current.x) > 4 ||
                    Math.abs(t.clientY - touchStartPos.current.y) > 4
                ) {
                    touchMoved.current = true;
                }

                lastPos.current = { x: t.clientX, y: t.clientY };
                setTransform((tr) => ({ ...tr, x: tr.x + dx, y: tr.y + dy }));
            } else if (e.touches.length === 2) {
                const dist = Math.hypot(
                    e.touches[1].clientX - e.touches[0].clientX,
                    e.touches[1].clientY - e.touches[0].clientY
                );
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;

                if (lastPinchDist.current !== null) {
                    const factor = dist / lastPinchDist.current;
                    const cx =
                        (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
                    const cy =
                        (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

                    setTransform((t) => {
                        const ns = Math.min(4, Math.max(0.1, t.scale * factor));
                        return {
                            scale: ns,
                            x: cx - (cx - t.x) * (ns / t.scale),
                            y: cy - (cy - t.y) * (ns / t.scale),
                        };
                    });
                }

                lastPinchDist.current = dist;
            }
        },
        [canvasRef, setTransform]
    );

    const onTouchEnd = useCallback(() => {
        dragging.current = false;
        lastPinchDist.current = null;
    }, []);

    return {
        dragging,
        onWheel,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    };
}