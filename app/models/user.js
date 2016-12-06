const db = require('../config/db');

/**
* User model:
* Hægt er að setja inn generator sem sjálfkrafa nextar eftir hvert db call
* Einnig hægt samt að nota bara hefðbundin callbacks*/
class User {
  constructor(user){
    this.setUser(user);
  }

  /* Býr til nýjan notenda, stillir objectið á hann og setur í db */
  create(user, cb){
    this.setUser(user);
    let userValues =  [this.name, this.phone, this.email, this.firstSemester,
                      this.startedElectives, this.graduating];
    let q = 'INSERT INTO users (name, phone, email, firstSemester, startedElectives, graduating) VALUES(?, ?, ?, ?, ?, ?)';

    db.query(q, userValues, (error, results)=>{
        this.id = results.insertId;
        this._finish(error, results, cb);
      }
    )
  }

  update(user, cb){
    this.setUser(user);
    let userValues =  [this.name, this.phone, this.email, this.firstSemester,
                      this.startedElectives, this.graduating, this.id];
    let q =  'UPDATE users SET name=?, phone=?, email=?, firstSemester=?, '+
                  'startedElectives=?, graduating=? WHERE ID=?';

    db.query(q, userValues, (error, results)=>{
        this._finish(error, results, cb);
      }
    )
  }

  /* Sækir notendan + facebook upplýsingar með facebook id */
  getFacebook(fbId, cb){
    let q = 'SELECT * FROM userWithFacebook WHERE facebookID = ?';
    db.query(q, [fbId], (error, results)=>{
        if(results.length === 0){
          results = null;
        }
        else{
          results = results[0];
          this.setUser(results);
        }
        this._finish(error, results, cb);
    });
  }

  /* Sækir tög fyrir notendann */
  getTags(cb){
    let q = 'CALL userTags(?)'

    db.query(q, [this.id], (error, results, fields)=>{
        this._finish(error, results[0], cb);
      }
    )
  }

  /* Sækir tög fyrir notendann */
  getTagsNames(cb){
    let q = 'CALL userTagsNames(?)';
    let resultSet = [];

    db.query(q, [this.id], (error, results, fields)=>{
        if(results){
          for(let row of results[0]){
            resultSet.push(row.name);
          }
          this._finish(error, resultSet, cb);
        }
        else{
          this._finish(error, results[0], cb);
        }
      }
    )
  }

  /*  bætir við taggi í userTechTags töfluna
      TODO: ætti að vera hægt að búa til nýtt tag hér og setja það síðan inn*/
  addTag(tagID, cb){
    let q = 'INSERT INTO userTechTags (tagID, userID) VALUES(?, ?)';

    db.query(q, [tagID, this.id], (error, results, fields)=>{
        this._finish(error, results, cb);
      }
    )
  }

  /*  bætir við mörgum töggum í userTechTags töfluna */
  addTags(tags, cb){
    let q = 'INSERT INTO userTechTags (tagID, userID) VALUES ?';

    let values = [];

    for(let id of tags){
      values.push([id, this.id]);
    }

    console.log(values);
    db.query(q, [values], (error, results, fields)=>{
        this._finish(error, results, cb);
      }
    )
  }

  /*  eyðir taggi í userTechTags töfluna*/
  deleteTag(tagIDs, cb){
    let q = 'DELETE FROM userTechTags WHERE tagID=? AND userID=?';

    db.query(q, [tagID, this.id], (error, results, fields)=>{
        this._finish(error, results, cb);
      }
    )
  }

  /*  eyðir öllum tögum í userTechTags töfluna*/
  deleteAllTags(cb){
    let q = 'DELETE FROM userTechTags WHERE userID=?';

    db.query(q, [this.id], (error, results, fields)=>{
        this._finish(error, results, cb);
      }
    )
  }

  /* addar facebook upplýsingum notendans í userFacebook */
  addFacebook(fb, cb){
    let insertInfo = [fb.id, fb.token, fb.email, fb.name, this.id];
    let q = 'INSERT INTO userFacebook (ID, token, email, name, userID) VALUES(?, ?, ?, ?, ?)';

    db.query(q, insertInfo, (error, results, fields)=>{
        this._finish(error, results, cb);
      }
    )
  }

  /* Setur inn generatorinn sem modelið notar og setur hann í gang*/
  setGenerator(generator){
    this.generator = generator;
    generator.next();
  }

  /* Stillir userinn*/
  setUser(user){
    if(user){
      if('id' in user || 'ID' in user) this.id = user.id || user.ID
      if('name' in user) this.name = user.name;
      if('phone' in user) this.phone = user.phone;
      if('email' in user) this.email = user.email;
      if('firstSemester' in user) this.firstSemester = user.firstSemester;
      if('startedElectives' in user) this.startedElectives = user.startedElectives;
      if('graduating' in user) this.graduating = user.graduating;
    }
  }

  /* Static function sem skilar user byggt á id*/
  static findById(userId, cb){
    let q = 'SELECT * FROM users WHERE ID = ?';
    db.query(q, [userId], (error, results)=>{
        if(cb){
          if(results.length === 0){
            cb(error, null);
          }
          else{
            let user = new User(results[0]);
            user.getTagsNames((error, results)=>{
              user.tags = results;
              cb(error, user);
            });
          }
        }
      }
    )
  }

  /* method sem er alltaf kallað eftir að db-in skilar niðurstöðum
   * Ef generator er define-aður þá nextar hann generatorinn og keyrsla
   * á aðal kóðanum heldur áfram */
  _finish(error, results, cb){
    if(this.generator){
      this.generator.next([error, results]);
    }
    if(cb){
      cb(error, results)
    }
  }

}

module.exports = User;
