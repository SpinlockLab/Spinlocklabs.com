/**
 * Tailwind v4 is configured in src/styles/global.css (@theme tokens, @plugin,
 * @import). This file exists only for the @tailwindcss/typography `css` API,
 * which is still config-driven. It is loaded via `@config` from global.css.
 *
 * The prose colors below must match the @theme tokens in global.css
 * (ink/paper/line/accent). They are literal hex because @config is JS and
 * cannot read CSS custom properties.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#3e424b",
            "--tw-prose-headings": "#16181d",
            "--tw-prose-lead": "#61666f",
            "--tw-prose-links": "#3e424b",
            "--tw-prose-bold": "#16181d",
            "--tw-prose-counters": "#8b8f97",
            "--tw-prose-bullets": "#8b8f97",
            "--tw-prose-hr": "#e2e4e8",
            "--tw-prose-quotes": "#16181d",
            "--tw-prose-quote-borders": "#c9ccd2",
            "--tw-prose-captions": "#61666f",
            "--tw-prose-code": "#16181d",
            "--tw-prose-pre-bg": "#f7f8fa",
            "--tw-prose-pre-border": "#e2e4e8",
            "--tw-prose-th-borders": "#c9ccd2",
            "--tw-prose-td-borders": "#e2e4e8",
            "a": {
              color: "#16181d",
              fontWeight: "500",
              textDecorationColor: "#c9ccd2",
              textUnderlineOffset: "3px",
              transitionProperty: "text-decoration-color",
              transitionDuration: "150ms",
            },
            "a:hover": {
              color: "#16181d",
              textDecorationColor: "#2148ff",
            },
          },
        },
      },
    },
  },
};
