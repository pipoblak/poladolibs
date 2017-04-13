function pageLoad(){
  if(isAlarmOn){
    $("#btnAtivar").text("Desativar");
    $("#alarmRepeat").attr('disabled', true);
    $("#alarmRepeat").attr('checked', repeatAlarm);
    $("#datetimepicker4").addClass("hide");
    $("#datetimepicker4").closest("div").addClass("has-success");
    $(document).find("#error-label").text(targetDate);
    $(document).find("#daysOfWeekHolder").children("button").each(function(){
      if($(document).find(event.target).attr("data-id")){
        daysOfWeek.push($(this).attr("data-id"));
        $(this).addClass("selected");
      }
      else{
        $(this).removeClass("selected");
      }

    });
  }
}
