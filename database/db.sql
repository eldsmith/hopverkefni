/*Users taflan geymir basic upplýsingar um notendan,
ég veit ekki ennþá hvaða kröfur loginkerfin setja þannig
ég reiknaði bara ekkert með þeim í þetta.
Annars er þetta frekar basic, tek bara inn grunnupplýsingar
um notendurna. Annars er flest geymt í tengitöflum*/
CREATE TABLE users(
	ID int auto_increment PRIMARY KEY,
	name varchar(255),
	phone int(7),
	email varchar(255),
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
	name varchar(255) UNIQUE
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
);
/*Þessi tala heldur utan um mötch, er ekki viss um
hvernig mér tókst að láta hana fara framhjá mér
matcherID heldur utan um þann sem er að matcha
matcheeID heldur utan um þann sem er verið að matcha(eða ekki)
við. shownLove er síðan bool sem segir til um hvort
matchið var jákvætt eða ekki*/
CREATE TABLE matching(
	ID int auto_increment PRIMARY KEY,
	matcherID int,
	matcheeID int,
	shownLove boolean
);


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

/*View sem ég er að nota í user modelinu, það má replace-a þetta í framtíðinni*/
CREATE VIEW `userWithFacebook` AS
    SELECT
        `users`.`ID` AS `ID`,
        `users`.`name` AS `name`,
        `users`.`phone` AS `phone`,
				`users`.`email` AS `email`,
        `users`.`firstSemester` AS `firstSemester`,
        `users`.`startedElectives` AS `startedElectives`,
        `users`.`graduating` AS `graduating`,
        `userFacebook`.`ID` AS `facebookID`,
        `userFacebook`.`token` AS `token`,
        `userFacebook`.`email` AS `facebookEmail`,
        `userFacebook`.`name` AS `facebookName`
    FROM
        (`users`
        JOIN `userFacebook` ON ((`userFacebook`.`userID` = `users`.`ID`)));

delimiter $$
drop procedure if exists userInfo $$
create procedure userInfo(userID int)
begin
	SELECT users.name, users.phone, users.email, users.firstSemester, users.startedElectives, users.graduating
	FROM users
	WHERE users.ID = userID;
end$$
delimiter ;

delimiter $$
drop procedure if exists userTags $$
create procedure userTags(userID int)
begin
	SELECT tags.name
	FROM tags
	INNER JOIN userTechTags ON tags.ID = userTechTags.tagID
	WHERE userTechTags.userID = userID;
end$$
delimiter ;

delimiter $$
drop procedure if exists getTags $$
create procedure getTags()
begin
	SELECT techtags.name
	FROM techtags;
end$$
delimiter ;

delimiter $$
drop procedure if exists getUsers $$
create procedure getUsers()
begin
	SELECT users.ID
	FROM users;
end$$
delimiter ;

delimiter $$
drop procedure if exists getMatches $$
create procedure getMatches(userID int)
begin
	-- CREATE TEMPORARY TABLE loveShown
	-- declare loveShown = (SELECT matching.matcheeID FROM matching WHERE matching.matcherID = userID AND shownLove = 1)
	-- declare
end$$
delimiter ;
