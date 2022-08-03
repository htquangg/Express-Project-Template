import server, { AppConfig } from './server';

server.listen(AppConfig.data.port, () => {
  console.log(`Server is listening on port ${AppConfig.data.port}...`);
});
