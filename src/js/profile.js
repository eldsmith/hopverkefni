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
      email: $("#email").val(),
      firstSemester: $("input:radio[name=firstSemester]:checked").val(),
      startedElectives: $("input:radio[name=takingElectives]:checked").val(),
      graduating: $("input:radio[name=isGraduating]:checked").val()
    }

    $.post('/api/user', userData, function(data, textStatus, xhr) {
      console.log(data, textStatus, xhr);
      swal("Vúhúú", "Uppfærsla gagnanna tókst hnökralaust", "success");
    });

  });




  // TAGS BABY
  var tagArray = [];
  var allTags = [];
  var userTags = [];
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

    $.get("/api/user/tags", function(data, status) {
      data.forEach( function(thing, index) {
        userTags.push(thing.name);
        var index = allTags.indexOf(thing.name);
        if (index > -1) {
          allTags.splice(index, 1);
        }
      });
      loadUserTags(userTags);
      tagArray = userTags;
      console.log(tagArray);
    })
  });
  function loadUserTags(array) {
    for (var i = 0; i < array.length; i++) {
      var box = $('#techList');
      var tag = array[i];
      var deletr = document.createElement("div");
      var thing = document.createElement("span");
      box.append(thing);
      thing.innerHTML = tag;
      thing.className = "chosenTag";
      deletr.className = "fa fa-times deleteTag";
      deletr.addEventListener("click", deleteThing);
      thing.appendChild(deletr);
      document.getElementById('addTag').value = "";
    }
  }
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
    console.log(tagArray);
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
