$(function(){
  'use strict'
  $.getScript('assets/azia/lib/jquery-ui/ui/widgets/datepicker.js', function() {
 // Datepicker
 $('.fc-datepicker').datepicker({
  showOtherMonths: true,
  selectOtherMonths: true
});

$('[data-toggle="tooltip"]').tooltip();
  })
});