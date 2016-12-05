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
})()