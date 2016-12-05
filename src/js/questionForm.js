(function(){

  var questionData = {
    firstSemester: {
      text: "Er þetta þín fyrsta önn?",
      answer: false
    },
    graduating: {
      text: "Ertu að útskrifast þessa önn?",
      answer: false
    },
    startedElectives: {
      text: "Ertu búin/n með grunndeild?",
      answer: false,
      yes: 'graduating',
      no: 'firstSemester'
    }
  }


  var questionForm = new Vue({
    el: '#question-form',
    data: {
      index: 0,
      question: questionData.startedElectives,
      questions: []
    },
    methods: {
      answerQuestion: function(answer){
        this.question.answer = answer === 'yes';
        this.questions.push(this.question);
        this.index++;

        var nextQuestion = this.question[answer];

        if(nextQuestion){
          this.question = questionData[nextQuestion];
        }
        else{
          $.ajax('/api/semester', {
            type: 'POST',
            data: {
              startedElectives: questionData.startedElectives.answer,
              graduating: questionData.graduating.answer,
              firstSemester: questionData.firstSemester.answer
            },
            success: function(data){
              console.log(data);
            },
            error: function(data){
              console.log(data);
            }
          })
        }
      }
    }
  });


})()
