import server, { AppConfig } from './server';

const webPort = AppConfig.data.PORT;

server.listen(webPort, () => {
  console.log(`Server is listening on port ${webPort}...`);
});
