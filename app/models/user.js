const db = require('../config/db');

/**
* User model:
* Hægt er að setja inn generator sem sjálfkrafa nextar eftir hvert db call
* Einnig hægt samt að nota bara hefðbundin callbacks*/
class User {
  constructor(user){
    this._setUser(user);
  }

  /* Býr til nýjan notenda, stillir objectið á hann og setur í db */
  create(user, cb){
    this._setUser(user);
    let userValues =  [this.name, this.phone, this.email, this.firstSemester,
                      this.startedElectives, this.graduating];
    let select = 'INSERT INTO users (name, phone, email, firstSemester, startedElectives, graduating) VALUES(?, ?, ?, ?, ?, ?)';

    db.query(select, userValues, (error, results)=>{
        this.id = results.insertId;
        this._finish(error, results, cb);
      }
    )
  }

  /* Sækir notendan + facebook upplýsingar með facebook id */
  getFacebook(fbId, cb){
    let select = 'SELECT * FROM userWithFacebook WHERE facebookID = ?';
    db.query(select, [fbId], (error, results)=>{
        if(results.length === 0){
          results = null;
        }
        else{
          results = results[0];
          this._setUser(results);
        }
        this._finish(error, results, cb);
    });
  }

  /* addar facebook upplýsingum notendans í userFacebook */
  addFacebook(fb, cb){
    let insertInfo = [fb.id, fb.token, fb.email, fb.name, this.id];
    let select = 'INSERT INTO userFacebook (ID, token, email, name, userID) VALUES(?, ?, ?, ?, ?)';

    db.query(select, insertInfo, (error, results, fields)=>{
        this._finish(error, results, cb);
      }
    )
  }

  /* Setur inn generatorinn sem modelið notar og setur hann í gang*/
  setGenerator(generator){
    this.generator = generator;
    generator.next();
  }

  /* Static function sem skilar user byggt á id
   * TODO: bjóða upp á return á nýju instancei af clasanum */
  static findById(userId, cb){
    let select = 'SELECT * FROM users WHERE ID = ?';
    db.query(select, [userId], (error, results)=>{
        if(cb){
          cb(error, results);
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

  /* Helper function til að stilla this */
  _setUser(user){
    this.id = user.id || user.ID || this.id;
    this.name = user.name || this.name;
    this.phone = user.phone || this.phone;
    this.email = user.email || this.email;
    this.firstSemester = user.firstSemester || this.firstSemester;
    this.startedElectives = user.startedElectives || this.startedElectives;
    this.graduating = user.graduating || this.graduating;
  }
}

module.exports = User;
