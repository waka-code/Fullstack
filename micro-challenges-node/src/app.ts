import express from 'express';
import helmet from './middleware/helmet';
import cors from './middleware/cors';
import logger from './middleware/logger';
import rateLimiter from './middleware/rateLimiter';
import notFound from './middleware/notFound';
import errorHandler from './middleware/errorHandler';

import router, { hmacRawBodySaver } from './challenges/hmac';
import performance from './challenges/performance';

const app = express();

app.use(helmet);
app.use(cors);
app.use(logger);
app.use(rateLimiter);
app.use(express.json({ verify: hmacRawBodySaver }));

app.use('/hmac', router);
app.use('/performance', performance);

app.use(notFound);
app.use(errorHandler);

export default app;