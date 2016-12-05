(function(){
  $.get("/api/user", function(data, status) {
      $("#name").val(data.name);
      $("#phone").val(data.phone);
      $("#email").val(data.email);
      console.log(data);
      if (data.firstSemester) {
        $("input:radio[name=firstSemester][value=1]").prop("checked", true);
      }else {
        $("input:radio[name=firstSemester][value=0]").prop("checked", true);
      }
      if (data.startedElectives) {
        $("input:radio[name=takingElectives][value=1]").prop("checked", true);
      }else {
        $("input:radio[name=takingElectives][value=0]").prop("checked", true);
      }
      if (data.graduating) {
        $("input:radio[name=isGraduating][value=1]").prop("checked", true);
      }else {
        $("input:radio[name=isGraduating][value=0]").prop("checked", true);
      }
  });
  $("#profileSubmit").click(function() {
    var userData = {
      name: $("#name").val(),
      phone: $("#phone").val(),
      email: $("#email").val()
    }
    var semesterData = {
      firstSemester: $("input:radio[name=firstSemester]:checked").val(),
      startedElectives: $("input:radio[name=takingElectives]:checked").val(),
      graduating: $("input:radio[name=isGraduating]:checked").val()
    }
    $.post('/api/user', userData, function(data, textStatus, xhr) {
      console.log(data, textStatus, xhr);  
      swal("Vúhúú", "Uppfærsla gagnanna tókst hnökralaust", "success");
    });
    $.post('/api/user/semester', semesterData, function(data, textStatus, xhr) {
      console.log(data, textStatus, xhr);  
    });
  });




  // TAGS BABY
  var tagArray = [];
  var allTags = [];
  $(document).ready(function() {
    $("#addTag").autocomplete({
        source: allTags
    });

    $.get("/api/tags", function(data, status) {
      console.log(data);
      data.forEach( function(thing, index) {
        allTags.push(thing.name);
      });
      console.log(allTags);
    });
  });

  var textBoxToggled = function(){
    var box = $('#techList');
    var tag = $('#addTag').val();
    if (tag == "") {
      swal("Tagið má ekki vera tómt");
      return;
    }
    if ($.inArray(tag, tagArray) > -1) {
      swal("Bara er hægt að nota hvert tag einu sinni");
      return;
    }
    tagArray.push(tag);
    var deletr = document.createElement("div");
    var thing = document.createElement("span");
    box.append(thing);
    thing.innerHTML = tag;
    thing.className = "chosenTag";
    deletr.className = "fa fa-times deleteTag";
    deletr.addEventListener("click", deleteThing);
    thing.appendChild(deletr);
    document.getElementById('addTag').value = "";
    $('#addTag').focus();
    allTags.splice($.inArray(tag, allTags), 1);
  };
  $("#confirmTag").click(function() {
    textBoxToggled();
  }); 
  $('#addTag').keypress(function(e){
    if(e.which == 13){
      textBoxToggled();
    }
  });
  function deleteThing () {
    var soonGone = this.closest('.chosenTag');
    console.log(soonGone);
    var toBeRemoved = soonGone.textContent;
    console.log(toBeRemoved);
    tagArray.splice($.inArray(toBeRemoved, tagArray), 1);
    allTags.push(toBeRemoved);
    soonGone.remove();
    console.log("lala");
  };
})();