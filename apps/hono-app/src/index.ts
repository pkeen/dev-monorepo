import { Hono } from "hono";
// import { hello } from "@pete_keen/test-repo";
import hello from "@pete_keen/courses-test";

const app = new Hono();

app.get("/", (c) => {
	return c.text(hello("Peter"));
});

export default app;
