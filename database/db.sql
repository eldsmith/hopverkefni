/*Users taflan geymir basic upplýsingar um notendan,
ég veit ekki ennþá hvaða kröfur loginkerfin setja þannig
ég reiknaði bara ekkert með þeim í þetta.
Annars er þetta frekar basic, tek bara inn grunnupplýsingar
um notendurna. Annars er flest geymt í tengitöflum*/
CREATE TABLE users(
	ID int auto_increment PRIMARY KEY,
	name varchar(255),
	phone int(7),
	firstSemester boolean,
	startedElectives boolean,
	graduating boolean
);
/*Groups taflan heldur utan um hópana með tvöföldum primarykey
Það þýðir að einn notandi getur verið í mörgum hópum en þetta er
eitthvað sem við getum auðveldlega breytt ef við viljum það*/
CREATE TABLE groups(
	ID int auto_increment,
	userID int,
	FOREIGN KEY (userID) REFERENCES users(ID),
	PRIMARY KEY (ID, userID)
);
/*Þessi tafla heldur utan um tæknir sem notandi getur mögulega sett á sig*/
CREATE TABLE techTags(
	ID int auto_increment PRIMARY KEY,
	name varchar(255)
);
/*Tengitafla milli notendanna og tæknitaggana
double primarykey notaður til að fyrirbyggja
að einn notandi geti sett á sig sama taggið oft*/
CREATE TABLE userTechTags(
	tagID int,
	userID int,
	FOREIGN KEY (tagID) REFERENCES techTags(ID),
	FOREIGN KEY (userID) REFERENCES users(ID),
	PRIMARY KEY (tagID, userID)
);
/*Mjög basic tafla sem heldur utan um project
tengist við notendatöfluna og inniheldur bara
basic titil og lýsingu. Gæti verið kúl að tengja
þetta við tæknitöggin líka?*/
CREATE TABLE projects(
	ID int auto_increment PRIMARY KEY,
	title varchar(255),
	description longtext,
	userID int,
	FOREIGN KEY (userID) REFERENCES users(ID)
);
/*Þessi tafla heldur utan um alla mögulega utanaðkomandi
tengihlekki sem notandi getur haft. Til dæmis twitter
facebook, github, bitbucket osfrv*/
CREATE TABLE socialMedia(
	ID int auto_increment PRIMARY KEY,
	name varchar(255)
);
/*Tengitafla á milli notendana og socialMedia töflunnar.
inniheldur auka field til að geyma link að viðeigandi
socialMedia account*/
CREATE TABLE userSocialMedia(
	userID int,
	socialID int,
	socialLink varchar(255),
	FOREIGN KEY (userID) REFERENCES users(ID),
	FOREIGN KEY (socialID) REFERENCES socialMedia(ID),
	PRIMARY KEY (userID, socialID)
)


/*Sorry kemur beint úr forward engineer. En það er nauðsyn á spes töflu
fyrir facebookLogin, ástæðan fyrir spes töflu er vegna þess að upplýsingar eru
mismunandi eftir social media logins, (twitter er t.d. með usernames) og þá þarf
hvert social media login að geyma mismunandi upplýsingar*/
DROP TABLE IF EXISTS `Hopverkefni`.`userFacebook` ;

CREATE TABLE IF NOT EXISTS `Hopverkefni`.`userFacebook` (
  `ID` VARCHAR(255) NOT NULL COMMENT '',
  `token` VARCHAR(255) NOT NULL COMMENT '',
  `email` VARCHAR(255) NULL COMMENT '',
  `name` VARCHAR(255) NULL COMMENT '',
  `userID` INT(11) NOT NULL COMMENT '',
  PRIMARY KEY (`ID`)  COMMENT '',
  INDEX `fk_userFacebookLogin_users1_idx` (`userID` ASC)  COMMENT '',
  UNIQUE INDEX `userID_UNIQUE` (`userID` ASC)  COMMENT '',
  CONSTRAINT `fk_userFacebookLogin_users1`
    FOREIGN KEY (`userID`)
    REFERENCES `Hopverkefni`.`users` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
