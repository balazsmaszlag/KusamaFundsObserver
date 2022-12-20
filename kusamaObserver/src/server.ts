// Setup server to Prometheus scrapes:

import express from 'express';
import {getConfig} from './config';
import { register } from 'prom-client';
import KusamaObserver from './index';

const app = express();
const port = getConfig().port;

app.get('/', async (req, res) => {
	try {
		res.set('Content-Type', "application/json");
		res.end('{"Hello": "World!"}');
	} catch (ex) {
		res.status(500).end(ex);
	}
});

app.get('/metrics', async (req, res) => {
	try {
		res.set('Content-Type', register.contentType);
		res.end(await register.getSingleMetricAsString('fund_metrics'));
	} catch (ex) {
		res.status(500).end(ex);
	}
});

console.log(
	`Server listening to ${port}, metrics exposed on /metrics endpoint`,
);
app.listen(port);

let ko = new KusamaObserver();
ko.observeFounds().catch(console.error);