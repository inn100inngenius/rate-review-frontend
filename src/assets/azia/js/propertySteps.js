$(function(){
  'use strict'

  $('#wizard2').steps({
    headerTag: 'h3',
    bodyTag: 'section',
    autoFocus: true,
    titleTemplate: '<span class="number">#index#</span> <span class="title">#title#</span>',
    onStepChanging: function (event, currentIndex, newIndex) {
      if(currentIndex < newIndex) {
        // Step 1 form validation
        if(currentIndex === 0) {
          var pname = $('#propertyname').parsley();
          var addr = $('#address').parsley();
          var zip = $('#zipcode').parsley();

          if(pname.isValid() && addr.isValid() && zip.isValid()) {
            return true;
          } else {
            pname.validate();
            addr.validate();
            zip.validate();
          }
        }

        // Step 2 form validation
        if(currentIndex === 1) { 
          var email = $('#email').parsley();
          var totuser = $('#totalusers').parsley();
          if(email.isValid() && totuser.isValid()) {
            return true;
          } else { 
            email.validate();
            totuser.validate();                
          }
        }
      // Always allow step back to the previous step even if the current step is not valid.
      } else { return true; }
    }
  });


  $('.az-form-group .form-control').on('focusin focusout', function(){
    $(this).parent().toggleClass('focus');
  });

});