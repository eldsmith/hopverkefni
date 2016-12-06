// Finds how well mainUser matches to matchingUser
const userMatch = (mainUser, matchingUser) => {
  const semesterWeight = 0.6; //Hversu svipað langt þeir eru komnir í náminu weighar
  const tagWeight = 0.4; //Hversu mikið tögin matcha

  //Steps ættu að vera einn deilt með max difference mögulegan milli semesters
  const semesterSteps = 1 / 3;

  //scores
  let tagScore = 0;
  let rankScore = 0;
  let semesterScore = 0;
  let finalScore = 0;

  for(let user of [mainUser, matchingUser]){
    if(user.takingElectives){
      if(user.graduating) user.semester = 4
      else user.semester = 3;
    }
    else{
      if(user.firstSemester) user.semester = 1;
      else user.semester = 2;
    }
  }

  //Tags score
  if(mainUser.tags.length > 0 && matchingUser.tags.length > 0){

    // Ákvörðun tekin um hversu mikið á að bæta við fyrir hvert match byggt á
    // muninum milli hæsta fjölda og lægsta.
    let highest = Math.max(mainUser.tags.length, matchingUser.tags.length);
    let lowest = Math.min(mainUser.tags.length, matchingUser.tags.length)
    let difference = (highest - lowest);

    if(difference > 5) difference = 5
    difference = difference / 1.5

  	let addScore = 1 / (highest - difference);
    console.log(addScore);

    for(let tag of mainUser.tags){
      if(matchingUser.tags.indexOf(tag) > -1)
        tagScore += addScore * tagWeight;
    }
  }

  //Semester compatibility
  semesterScore = Math.abs(mainUser.semester - matchingUser.semester) * semesterSteps;
  semesterScore = (1 - semesterScore) * semesterWeight;

  matchingUser.score = {
    semesterScore: +semesterScore.toFixed(2),
    tagScore: +tagScore.toFixed(2),
    totalScore: +(semesterScore + tagScore).toFixed(2),
  }
  console.log(matchingUser.score);
}

module.exports = userMatch;

//Match a user with a group
/*
const groupMatch = (mainUser, group)=>{
	let result = {users:[], score: {totalScore:0}, name: group.name};
  let score = 0;

  for(let matchingUser of group.users){
  	let matchedUser = userMatch(mainUser, matchingUser);
  	score += matchedUser.score.totalScore;
    result.users.push(matchedUser);
  }

  result.score.totalScore = score / result.users.length;
  return result;
}

//matches a user to multiple matches both user and group and sorts by totalScore
const bulkMatch = (user, matches)=>{
	let result = [];
  let matched;

  for(let match of matches){
  	if(Array.isArray(match.users)){
    	matched = groupMatch(user,match);
      matched.type = 'group';
    }
    else{
    	matched = userMatch(user, match);
      matched.type = 'user';
    }
    result.push(matched);
  }

  //sort by totalScore
  result.sort((a,b)=>{
  	return b.score.totalScore - a.score.totalScore;
  });

  for(let match of result){
  	let jsonOut = {
    	totalScore: match.score.totalScore,
      type: match.type,
   		name: match.name || match.matchingUser.name
    }
    if(match.type === 'group'){
    	jsonOut.userScore = [];
    	for(let user of match.users){
      	jsonOut.userScore.push(user.score);
      }
    }
    else{
    	jsonOut.userScore = match.score;
    }
  	$('#results').append(JSON.stringify(jsonOut, undefined, 2));
  }
};
*/
