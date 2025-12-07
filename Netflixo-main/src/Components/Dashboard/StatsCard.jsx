import React from "react";
import { motion } from "framer-motion";
import { FiTrendingUp } from "react-icons/fi";
import AnimatedCounter from "../AnimatedCounter";

function StatsCard({ title, value, subtitle, icon: Icon, trend, color = "subMain" }) {
    const colorClasses = {
        subMain: {
            iconBg: "bg-subMain/20",
            iconText: "text-subMain",
            border: "border-subMain/30",
        },
        green: {
            iconBg: "bg-success/20",
            iconText: "text-success",
            border: "border-success/30",
        },
        blue: {
            iconBg: "bg-info/20",
            iconText: "text-info",
            border: "border-info/30",
        },
        yellow: {
            iconBg: "bg-warning/20",
            iconText: "text-warning",
            border: "border-warning/30",
        },
        red: {
            iconBg: "bg-error/20",
            iconText: "text-error",
            border: "border-error/30",
        },
    };

    const colors = colorClasses[color];

    // Check if value is a number or string
    const isNumber = typeof value === "number" || !isNaN(parseInt(value));
    const numericValue = isNumber ? (typeof value === "number" ? value : parseInt(value)) : null;

    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className={`glass-card backdrop-blur-xl p-6 rounded-2xl border-2 ${colors.border} border-white/10 hover:border-${color} transition-all duration-300 group`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colors.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`text-2xl ${colors.iconText}`} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-sm text-success">
                        <FiTrendingUp />
                        <span>+{trend}%</span>
                    </div>
                )}
            </div>

            <h3 className="text-3xl font-bold text-white mb-1">
                {numericValue !== null ? (
                    <AnimatedCounter end={numericValue} />
                ) : (
                    value
                )}
            </h3>

            <p className="text-sm text-text-secondary">{subtitle || title}</p>
        </motion.div>
    );
}

export default StatsCard;
