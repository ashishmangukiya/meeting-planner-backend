config={};  


config.port=3000;
config.env='dev';
config.allowedCorsOrigin='*';
config.version='/api/v1';
config.db={
    uri:'mongodb://127.0.0.1:27017/meetingDB'
}

module.exports={
    port:config.port,
    environment:config.env,
    allowedCorsOrigin:config.allowedCorsOrigin,
    version:config.version,
    dbs:config.db
}