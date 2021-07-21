const app = require('./app');
require('./db/connect');
require('./emails').checkEmail();

app.listen(process.env.PORT || 3000);
