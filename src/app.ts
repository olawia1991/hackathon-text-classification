import * as express from 'express';
import router from './routes';

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.use('/api', router);

process.on('uncaughtException', (err) => {
  console.error(err);
  process.exit(1);
});

export default app;
