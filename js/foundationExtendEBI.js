/* Copyright (c) EMBL-EBI 2016
   Authors: 
   Ken Hawkins (khawkins@ebi.ac.uk)
*/

// Foundation specific extensions of functionality
(function($) {

  // Clone the local menu into a mobile-only menu
  // -----------
  var localMenuClass = 'ul.dropdown.menu.float-left';
  // var localMenuClass = '#secondary-menu-links'; // temp for testing
  // $(localMenuClass).addClass('dropdown'); // temp for testing
  var localMenuWidthTotal = $(localMenuClass).width();
  var localMenuWidthUsed = 0;

  // todo: run this on browser resize events

  // Calculate how much space we need, if any
  $(localMenuClass+' > li').each( function() {
    localMenuWidthUsed = localMenuWidthUsed + $(this).width();
  });

  // do we need to make space?
  if (localMenuWidthUsed > localMenuWidthTotal) {

    // create dropdown if needed
    if ($(localMenuClass + 'li.extra-items-menu').length == 0) { 
      $(localMenuClass).append('<li class="extra-items-menu"><a href="#">Also in this section</a><ul class="menu"></ul></li>');
      localMenuWidthUsed = localMenuWidthUsed + $(localMenuClass + 'li.extra-items-menu').width();
    }

    // loop through each menu item in reverse
    $($(localMenuClass+' > li').get().reverse()).each( function() {
      if (localMenuWidthUsed > localMenuWidthTotal) { // do we need to hide more items?
        localMenuWidthUsed = localMenuWidthUsed - $(this).width();
        $(this).detach().prependTo(localMenuClass + 'li.extra-items-menu ul.menu');
      }
    });

  } else {
    // to do: restore menu items with any free space 

    // to do: if there is only one drop down item, perhaps we can delete the dropdown and restore the item...
  }

  // Clearable text inputs
  // via: http://stackoverflow.com/questions/6258521/clear-icon-inside-input-text 
  // -------------
  function tog(v){return v?'addClass':'removeClass';} 
  $(document).on('input', '.clearable', function(){
    $(this)[tog(this.value)]('x');
  }).on('mousemove', '.x', function( e ){
    $(this)[tog(this.offsetWidth-25 < e.clientX-this.getBoundingClientRect().left)]('onX');
  }).on('touchstart click', '.onX', function( ev ){
    ev.preventDefault();
    $(this).removeClass('x onX').val('').change().keyup();
  });

  $.fn.foundationExtendEBI = function() {
    // Link overlay images
    $(function() {
      $('.with-overlay').click(function(e) {
        var href = $(this).find('a:first').attr('href') || '';
        if (href.length > 0) {
          window.location.href = href;
        }
      })
    });

    // Responsive support for tables
    // Clone the class from a parent TH to any child TD
    jQuery('table.responsive-table').each( function() {
      var columnsToAppend = jQuery(this).find('th');
      for (var i = 0; i < columnsToAppend.length; i++) {
        if (jQuery(columnsToAppend[i]).attr('class')) {
          var position = i + 1;
          jQuery(this).find('td:nth-child('+position+')').addClass(jQuery(columnsToAppend[i]).attr('class'));
        }
      };
    });

    // Smooth scroll anchor links for jQuery users
    $(function() {
      $('a[href*=#]:not([href=#])').click(function() {
        // Table compatibility
        if ($(this).parent().parent().hasClass('tabs')) {
          return true; //exit
        }
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash),
              targetName = this.hash;
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top - 40
            }, {
              duration: 1000,
              complete: function(){ window.location.hash = targetName; }
            });
            return false;
          }
        }
      });
    });
  }

}(jQuery));
