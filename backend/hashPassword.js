const bcrypt = require('bcrypt');

bcrypt.hash("Password0", 10, (err, hash) => {
    if (err) throw err;
    console.log("Hashed Password:", hash);
});
