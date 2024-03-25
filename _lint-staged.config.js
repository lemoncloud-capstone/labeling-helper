module.exports = {
    '{apps,tools,libs}/**/*.{ts,js,tsx,jsx,json,md,html,css,scss}': [
        'nx affected --target lint --uncommitted --fix true',
        'nx format:write --uncommitted',
    ],
};
