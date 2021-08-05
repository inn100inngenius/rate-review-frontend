$(function(){
  'use strict'


  $('.az-form-group .form-control').on('focusin focusout', function(){
    $(this).parent().toggleClass('focus');
  });

  $(document).ready(function(){
    $('.select2').select2({
      placeholder: 'Choose properties'
    });

    $('.select2-no-search').select2({
      minimumResultsForSearch: Infinity,
      placeholder: 'Choose one'
    });
  });

});