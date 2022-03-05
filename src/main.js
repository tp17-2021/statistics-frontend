import "./global.css";
import HMR from "@roxi/routify/hmr";
import App from "./App.svelte";

const app = HMR(App, { target: document.body }, "routify-app");

function abbr(x, count = 4) {
    count = x.length < count ? x.length : count;
    return x.substring(0, count);
}

export default app;
