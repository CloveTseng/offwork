import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  // 規範連結：https://reurl.cc/1OvxMm
  theme: {
    extend: {
      // 標準色
      colors: {
        // 主色
        primary: {
          "50": "#F7FBEA",
          "100": "#EDF6D1",
          "200": "#DBEDA9",
          "300": "#C1E076",
          DEFAULT: "#A4CD44",
          "500": "#8AB42E",
          "600": "#6B9020",
          "700": "#516E1D",
          "800": "#43581C",
          "900": "#3A4B1C",
          "950": "#1C290A",
        },
        // 副色
        secondary: {
          "50": "#EFF9FC",
          "100": "#D8EFF6",
          "200": "#B3E0EE",
          "300": "#7FC9E1",
          DEFAULT: "#5AB3D2",
          "500": "#288DB2",
          "600": "#237296",
          "700": "#245D7A",
          "800": "#254E65",
          "900": "#234256",
          "950": "#122A3A",
        },
        // 中性色
        neutral: {
          "50": "#F7F7F8",
          "100": "#EFEEF0",
          "200": "#DBDADD",
          "300": "#BAB9C0",
          "400": "#959595",
          "500": "#777582",
          "600": "#615F6A",
          "700": "#504E56",
          DEFAULT: "#44434A",
          "850": "#3C3C3E",
          "900": "#333339",
          "950": "#29292D",
          "1000": "#1A1A1C",
        },
        // 強調
        accent: "#F15A3C",
        // 警告
        alert: {
          success: "#A4CD44",
          DEFAULT: "#F15A3C",
        },
      },
      // 標準字
      // 字重可用 ＂font-＂ 來設定：https://v3.tailwindcss.com/docs/font-weight
      fontSize: {
        h1: [
          "3rem",
          {
            lineHeight: "1.2",
          },
        ],
        h2: [
          "2.25rem",
          {
            lineHeight: "1.2",
          },
        ],
        h3: [
          "2rem",
          {
            lineHeight: "1.2",
          },
        ],
        h4: [
          "1.75rem",
          {
            lineHeight: "1.2",
          },
        ],
        h5: [
          "1.5rem",
          {
            lineHeight: "1.2",
          },
        ],
        xl: [
          "1.25rem",
          {
            lineHeight: "1.4",
          },
        ],
        lg: [
          "1.125rem",
          {
            lineHeight: "1.4",
          },
        ],
        md: [
          "1rem",
          {
            lineHeight: "1.6",
          },
        ],
        sm: [
          "0.875rem",
          {
            lineHeight: "1.6",
          },
        ],
        xs: [
          "0.75rem",
          {
            lineHeight: "1.6",
          },
        ],
        xxs: [
          "0.688rem",
          {
            lineHeight: "1.6",
          },
        ],
      },
    },
  },
};
