function pageLoad(){
  if(isAlarmOn){
    onAlarmOn();
  }
}
function onAlarmOn(){
  $("#btnAtivar").text("Desativar");
  $("#alarmRepeat").attr('disabled', true);
  $("#alarmRepeat").attr('checked', repeatAlarm);
  $("#clockpicker").addClass("hide");
  $("#clockpicker").parents("div").closest("div").addClass("has-success");
  $(document).find("#error-label").text(targetDate);
  $(document).find("#daysOfWeekHolder").children("button").each(function(){
    if(daysOfWeek.includes($(this).attr("data-id"))){
      $(this).addClass("selected");
    }
    else{
      $(this).removeClass("selected");
    }

  });
}
var input = $('.clockpicker').clockpicker({
    placement: 'bottom',
    align: 'left',
    autoclose: true,
    'default': 'now',
    donetext: 'Aplicar'
});


  var container = document.getElementById('container');
  var starfield = new Starfield();
  starfield.initialise(container);
  starfield.start();

  function randomise() {
    starfield.stop();
    starfield.stars = Math.random()*1000 + 50;
    starfield.minVelocity = Math.random()*30+5;
    starfield.maxVelocity = Math.random()*50 + starfield.minVelocity;
    starfield.start();
  }

  function btnAtivar(event){
    if(isAlarmOn){
      $.ajax({
        dataType: 'text',
        url : '/',
        data:{date:'false'},
        success: function(data){
          $("#btnAtivar").text("Ativar");
          $("#alarmRepeat").attr('disabled', false);
          $("#alarmRepeat").attr('checked', repeatAlarm);
          $("#clockpicker").removeClass("hide");
          $("#clockpicker").fadeIn(200);
          $("#clockpicker").parents("div").closest("div").removeClass("has-success");
          $(document).find("#error-label").fadeOut(200,function(){
            $(document).find("#error-label").text("");
          });
          isAlarmOn=false;
        },
        error:function(data){
          $("#clockpicker").parents("div").closest("div").removeClass("has-error");
          $("#clockpicker").parents("div").closest("div").removeClass("has-success");
          $("#clockpicker").parents("div").closest("div").addClass("has-error");
          $(document).find("#error-label").text("Houve um problema ao executar a requisição.");
          console.log(data);
        },
        complete: function(){
          setTimeout(5000);
        }
      });
    }
    else{
      var currentDate = moment();
      var time="";
      time = $('#clockpicker').find("input").val();
      var hours = time.substring(0,time.indexOf(":"));
      var minutes = time.substring(time.indexOf(":")+1);
      if(daysOfWeek.length == 7 ){
        repeatAlarm= true;
      }
      else{
        repeatAlarm= false;
      }
      if(time!=""){
        $(document).find("#error-label").slideUp(500, function(){
          $.ajax({
            dataType: 'text',
            url : '/',
            data:{
              hour:currentDate.hour(),minute:currentDate.minute(),second:currentDate.second(),month:(currentDate.month()+1),day:currentDate.date(),year:currentDate.year(),
              thours:hours,minutes:minutes,repeat:daysOfWeek.toString().replace(/\,/g,''),displaytime:time, repeatAlarm:repeatAlarm},
            success: function(data){
              $("#clockpicker").parents("div").closest("div").removeClass("has-error");
              $("#clockpicker").parents("div").closest("div").addClass("has-success");
              $("#btnAtivar").text("Desativar");
              $("#alarmRepeat").attr('disabled', true);
              $("#alarmRepeat").attr('checked', $("#alarmRepeat").is(':checked'));
              $("#clockpicker").fadeOut(200,function(){
                $("#clockpicker").addClass("hide");
              });
              $(document).find("#error-label").text(time);
              $(document).find("#error-label").fadeIn(200);
              isAlarmOn=true;
            },
            error:function(data){
              $("#clockpicker").parents("div").closest("div").removeClass("has-error");
              $("#clockpicker").parents("div").closest("div").removeClass("has-success");
              $("#clockpicker").parents("div").closest("div").addClass("has-error");
              $(document).find("#error-label").text("Houve um problema ao executar a requisição.");
              console.log(data);
            },
            complete: function(){
              setTimeout(5000);
            }
          });

        });
        $(document).find("#error-label").slideDown(500);
      }
      else{
        event.stopPropagation();
        input.clockpicker('show');
      }
    }

  }

  function btnDayOfWeek(event){
    if(!isAlarmOn){
      target =$(document).find(event.target);
      if(target.hasClass('selected')){
        target.removeClass('selected');
        daysOfWeek.splice(daysOfWeek.indexOf(target.attr("data-id")),1);
      }
      else{
        target.addClass('selected');
        daysOfWeek.push(target.attr("data-id"));
      }
      var leng = daysOfWeek.length;
      if(leng==7){
        $("#alarmRepeat").trigger('click');
      }
      else {
        $("#alarmRepeat").attr('checked', false);
      }
      daysOfWeek.sort();
    }
  }

  function repeatAllDays(event){
    daysOfWeek=[];
    $(document).find("#daysOfWeekHolder").children("button").each(function(){
      if($(document).find(event.target).is(':checked')){
        daysOfWeek.push($(this).attr("data-id"));
        $(this).addClass("selected");
      }
      else{
        $(this).removeClass("selected");
      }

    });
  }

  setInterval(function() {
    $.ajax({
      dataType: 'text',
      url : '/alarmOn',
      success: function(data){
        if(isAlarmOn.toString() != data){
          location.reload();
        }
      },

    });
  }, 5000);
