/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */

const { execute } = require("@getvim/execute");
require("dotenv").config();

const { DB_DOCKER_NAME, DB_NAME, DB_PORT, DB_PW } = process.env;

function logOutErr(r) {
  if (r.stdout || r.stderr){
    console.log(r.stdout || r.stderr);
  }
}

console.log(`Stopping docker cointainers with name ${DB_DOCKER_NAME}!`);
execute(`docker kill ${DB_DOCKER_NAME}`).then(logOutErr).catch(logOutErr).finally(() => {
  console.log(`Removing docker cointainers with name ${DB_DOCKER_NAME}`);
  execute(`docker rm ${DB_DOCKER_NAME}`).then(logOutErr).catch(logOutErr).finally(() => {
    console.log(`Creating docker a fresh posgres container with name ${DB_DOCKER_NAME}!`);
    execute(`docker run --name ${DB_DOCKER_NAME} ` + 
              `-e POSTGRES_PASSWORD=${DB_PW} `+
              `-e PGPASSWORD=${DB_PW} `+
              `-p ${DB_PORT}:${DB_PORT} `+
              `-d postgres`)
      .then(() => { 
        console.log(`Waiting 5 seconds for pg-server ${DB_DOCKER_NAME} to start!`);
        setTimeout(() => {
          console.log(`Creating DATABASE`);
          execute(`echo "CREATE DATABASE ${DB_NAME} ENCODING 'UTF-8';" | docker exec -i ${DB_DOCKER_NAME} psql -U postgres`).then(() => {
            execute(`echo "\l" | docker exec -i ${DB_DOCKER_NAME} psql -U postgres`).then(() => {
              execute(`yarn typeorm:migration:run`).catch((err) => { console.log("A error ocurred while executing database creation script!", err.stderr); });
            }).catch((err) => { console.log("A error ocurred while executing database creation script!", err.stderr); });
          }).catch((err) => { console.log("A error ocurred while executing database creation script!", err.stderr); });
        }, 5000);
      })
      .catch((err) => console.log("A error ocurred while trying to create a docker image!", err.stderr));
  });
});
