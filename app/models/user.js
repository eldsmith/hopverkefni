const db = require('../config/db');


/**
* Addar einum user í db
* @param {Object} user - userinn sem á að adda í db
* @param {string} [user.name]
* @param {string} [user.phone]
* @param {bool} [user.firstSemester] - hvort að notandi sé á fyrstu önn
* @param {bool} [user.startedElectives] - hvort að notandi sé byrjaður á valáföngum
* @param {bool} [user.graduating] - hvort að notandi sé að útskrifast
* @param {callback} [cb]
*/
exports.add = (user, cb)=>{
  let userInfo = [user.name, user.phone, user.firstSemester, user.startedElectives, user.graduating];

  db.query('INSERT INTO users (name, phone, firstSemester, startedElectives, graduating) VALUES(?, ?, ?, ?, ?)',
    userInfo, (error, results)=>{
      if(cb){
        cb(error, results);
      }
    }
  )
}


/**
* Addar facebook login info fyrir user
* @param {int} userId
* @param {object} fb - Object með öllum facebook upplýsingum
* @param {int} fb.id - id á notendan eins og hann finnst á facebook
* @param {string} fb.token
* @param {string} [fb.email]
* @param {callback} [cb]
*/
exports.addToFacebook = (userId, fb, cb)=>{
  let insertInfo = [fb.ID, fb.token, fb.email, fb.name, userId];

  db.query('INSERT INTO userFacebook (ID, token, email, name, userID) VALUES(?, ?, ?, ?, ?)',
    insertInfo, (error, results, fields)=>{
      if(cb){
        cb(error, results);
      }
    }
  )
}


/**
* Finnur notenda eftir id
* @param {int} userId
* @param {callback} [cb]
*/
exports.findById = (userId, cb)=>{
  db.query('SELECT * FROM users WHERE ID = ?',
    [userId], (error, results)=>{
      if(cb){
        cb(error, results);
      }
    }
  )
}

/**
* Finnur eina færslu í einhverji töflu sem tengist usernum
* FIXME: Nokkuð viss um að það sé til betri útfærsla á þessu
* @param {int} userId
* @param {callback} [cb]
*/
exports.findOne = (Id, table, cb)=>{
  // Það er möguleiki að select skipanir lýti öðruvísi út byggt á töflunni sem
  // er valin.
  let select;
  if(table === 'userFacebook' || table === 'userWithFacebook'){
    select = 'SELECT * FROM userWithFacebook WHERE facebookID = ?';
  }

  if(select)
  {
    db.query(select, [Id], (error, results)=>{
        if(results.length === 0){
          results = null;
        }
        if(cb) cb(error, results[0]);
    });
  }
  else throw('Invalid input for table');
}
