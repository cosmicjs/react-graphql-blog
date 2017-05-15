const sm = 768;

const md = 992;

const lg = 1200;

export const breakpoints = {
    xs: { min: 0, max: sm - 1, },
    sm: { min: sm, max: md - 1, },
    md: { min: md, max: lg - 1, },
    lg: { min: lg, max: 100000, },
};

export const bps = breakpoints;