import { useMemo } from "react";

const COLORS = ["#ef4444", "#facc15", "#22c55e", "#3b82f6"]; // red, yellow, green, blue

function Bulb({ color, delay, duration, active }) {
    return (
        <span
            className="block h-3 w-3 shrink-0 rounded-full transition-opacity duration-500 sm:h-4 sm:w-4"
            style={
                active
                    ? {
                        backgroundColor: color,
                        boxShadow: `0 0 6px 2px ${color}`,
                        animation: `bulbChase ${duration}s linear infinite`,
                        animationDelay: `${delay}s`,
                    }
                    : {
                        backgroundColor: color,
                        opacity: 0.15,
                        boxShadow: "none",
                    }
            }
        />
    );
}

export default function LightFrame({ children, top = 14, side = 8, active = true, maxWidth = "max-w-3xl" }) {
    const bulbs = useMemo(() => {
        const order = [];
        for (let i = 0; i < top; i++) order.push("top");
        for (let i = 0; i < side; i++) order.push("right");
        for (let i = 0; i < top; i++) order.push("bottom");
        for (let i = 0; i < side; i++) order.push("left");

        const step = 0.06; // seconds between each bulb lighting up
        const duration = order.length * step;

        return order.map((edge, i) => ({
            edge,
            color: COLORS[i % COLORS.length],
            delay: -(i * step),
            duration,
        }));
    }, [top, side]);

    const topBulbs = bulbs.filter((b) => b.edge === "top");
    const rightBulbs = bulbs.filter((b) => b.edge === "right");
    const bottomBulbs = bulbs.filter((b) => b.edge === "bottom").reverse();
    const leftBulbs = bulbs.filter((b) => b.edge === "left").reverse();

    return (
        <div className={`relative mx-auto w-full ${maxWidth}`}>
            <div className="flex justify-between px-5 sm:px-7">
                {topBulbs.map((b, i) => (
                    <Bulb key={`t${i}`} {...b} active={active} />
                ))}
            </div>
            <div className="flex">
                <div className="flex flex-col justify-between py-1">
                    {leftBulbs.map((b, i) => (
                        <Bulb key={`l${i}`} {...b} active={active} />
                    ))}
                </div>
                <div className="min-w-0 flex-1 px-2 py-2 sm:px-4">{children}</div>
                <div className="flex flex-col justify-between py-1">
                    {rightBulbs.map((b, i) => (
                        <Bulb key={`r${i}`} {...b} active={active} />
                    ))}
                </div>
            </div>
            <div className="flex justify-between px-5 sm:px-7">
                {bottomBulbs.map((b, i) => (
                    <Bulb key={`b${i}`} {...b} active={active} />
                ))}
            </div>
        </div>
    );
}