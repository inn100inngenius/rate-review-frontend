$(function(){
  'use strict'

  // $('[data-toggle="tooltip"]').tooltip();
  
  // $('#example1').DataTable({
  //   language: {
  //     searchPlaceholder: 'Search...',
  //     sSearch: '',
  //     lengthMenu: '_MENU_ items/page',
  //   }
  // });

  $('#example2').DataTable({
    responsive: true,
    autoWidth:true,
    language: {
      searchPlaceholder: 'Search...',
      sSearch: '',
      lengthMenu: '_MENU_ items/page',
    }
  });

  // Select2
  // $('.dataTables_length select').select2({ minimumResultsForSearch: Infinity });

});