const db = require('../config/db');

/**
* Tag model:
* Hægt er að setja inn generator sem sjálfkrafa nextar eftir hvert db call
* Einnig hægt samt að nota bara hefðbundin callbacks*/
class Tag {
  constructor(tag, cb){
    let create = true; //hvort eigi að setja tagið inn í db

    if(typeof tag === 'string'){
      this.name = tag;
    }
    else{
      this.name = tag.name;
      this.id = tag.ID || tag.id;
      create = !('create' in tag) || tag.create === true;
    }

    //Defaultið er að keyra create skipun nema að tag.create sé sett og sett á false
    if(create){
      this.create(cb);
    }
  }

  /* Býr til nýtt tag, stillir objectið á hann og setur í db
     Þarf að fylgjast með error.code === 'ER_DUP_ENTRY' */
  create(cb){
    let q = 'INSERT INTO techTags (name) VALUES(?)';

    db.query(q, [this.name], (error, results)=>{
        if(results) this.id = results.insertId;
        this._finish(error, results, cb);
      }
    )
  }

  /* Setur inn generatorinn sem modelið notar og setur hann í gang*/
  setGenerator(generator){
    this.generator = generator;
    generator.next();
  }

  /* Static function sem skilar tag byggt á id*/
  static findById(tagId, cb){
    let q = 'SELECT * FROM techTags WHERE ID = ?';
    db.query(q, [tagId], (error, results)=>{
        if(cb){
          results[0].create = false;
          let tag = new Tag(results[0]);
          cb(error, tag);
        }
      }
    )
  }

  /* Static function sem skilar öllum tags í db*/
  static getAll(cb){
    let q = 'SELECT * FROM techTags';
    db.query(q, [], (error, tags)=>{
        if(cb){
          cb(error, tags);
        }
      }
    )
  }

  static addTag(tag, cb){
    let q = 'INSERT INTO techTags (name) VALUES(?)';

    db.query(q, [tag], (error, results)=>{
      if(cb){
        cb(error, results);
      }
    });
  }

  /* Static function sem addar mörgum tögum í db*/
  static addTags(tags, cb){
    let q = 'INSERT INTO techTags (name) VALUES ?';
    let tagArray = [];

    for(let tag of tags){
      tagArray.push([tag]);
    }

    db.query(q, [tagArray], (error, tags)=>{
      if(cb){
        cb(error, tags);
      }
    });
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

module.exports = Tag;
