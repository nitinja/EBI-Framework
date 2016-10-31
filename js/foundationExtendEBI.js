/* Copyright (c) EMBL-EBI 2016
   Authors:
   Ken Hawkins (khawkins@ebi.ac.uk)
*/

// Analytics tracking
// This code tracks the user's clicks in various parts of the EBI site and logs them as GA events.
// Links in non-generic regions can be tracked by adding '.track-with-analytics-events' to a parent div. Careful with the scoping.
// -------------
var ga = ga || [];
if (ga.loaded) { jQuery('body').addClass('google-analytics-loaded'); }   // Confirm GA is loaded, add a class if found

// Utility method
if (!Array.prototype.last){
  Array.prototype.last = function(){
    return this[this.length - 1];
  };
};

function analyticsTrackInteraction(actedOnItem, parentContainer) {
  var linkName = jQuery(actedOnItem).text().toString();
  // if there's no text, it's probably and image...
  if (linkName.length == 0 && jQuery(actedOnItem).attr('src')) linkName = jQuery(actedOnItem).attr('src').split('/').last();
  if (linkName.length == 0 && jQuery(actedOnItem).val()) linkName = jQuery(actedOnItem).val();
  // console.log(parentContainer,linkName);
  ga('send', 'event', 'UI', 'UI Element / ' + parentContainer, linkName);
}

// Only track these areas
// This could be done more efficently with a general capture of links,
// but we're running against the page's unload -- so speed over elegance.

// Automatically detected areas
// These are largely legacy...
jQuery("body.google-analytics-loaded .masthead").on('mousedown', 'a', function(e) {
  analyticsTrackInteraction(e.target,'Masthead');
});
jQuery("body.google-analytics-loaded .related ul").on('mousedown', 'li > a', function(e) {
  analyticsTrackInteraction(e.target,'Popular');
});
jQuery("body.google-analytics-loaded .with-overlay").on('mousedown', 'a', function(e) {
  analyticsTrackInteraction(e.target,'Highlight box');
});
jQuery("body.google-analytics-loaded .intro-unit").on('mousedown', 'a', function(e) {
  analyticsTrackInteraction(e.target,'Intro');
});
jQuery("body.google-analytics-loaded #main-content-area").on('mousedown', 'a', function(e) {
  analyticsTrackInteraction(e.target,'Main content');
});
// jQuery("body.google-analytics-loaded .main.columns > article > .row > .medium-4 a, \
//   body.google-analytics-loaded .main.columns > article > .row > .medium-3").mousedown( function(e) {
//   analyticsTrackInteraction(e.target,'Sidebar');
// });
jQuery("body.google-analytics-loaded #global-footer").on( 'mousedown', 'a', function(e) {
  analyticsTrackInteraction(e.target,'Footer');
});
jQuery("body.google-analytics-loaded #global-search").on( 'mousedown', 'input', function(e) {
  analyticsTrackInteraction(e.target,'Global search');
});
jQuery("body.google-analytics-loaded #local-search").on( 'mousedown', 'input', function(e) {
  analyticsTrackInteraction(e.target,'Local search');
});
jQuery("body.google-analytics-loaded #ebi_search").on( 'mousedown', 'input#search_submit', function(e) {
  analyticsTrackInteraction(e.target,'Homepage search');
});

// Editor defined areas
// These areas will be manually tagged by content editors or implement by devs
jQuery("body.google-analytics-loaded .analytics-content-intro").on( 'mousedown', 'a', function(e) {
  analyticsTrackInteraction(e.target,'Intro');
});
jQuery("body.google-analytics-loaded .analytics-content-main").on( 'mousedown', 'a', function(e) {
  analyticsTrackInteraction(e.target,'Main content');
});
jQuery("body.google-analytics-loaded .analytics-content-sidebar").on( 'mousedown', 'a', function(e) {
  analyticsTrackInteraction(e.target,'Sidebar');
});
jQuery("body.google-analytics-loaded .analytics-content-left").on( 'mousedown', 'a', function(e) {
  analyticsTrackInteraction(e.target,'Left content');
});
jQuery("body.google-analytics-loaded .analytics-content-right").on( 'mousedown', 'a', function(e) {
  analyticsTrackInteraction(e.target,'Right content');
});
jQuery("body.google-analytics-loaded .analtyics-content-footer").on( 'mousedown', 'a', function(e) {
  analyticsTrackInteraction(e.target,'Content footer');
});



// todo: homepage search return
// $('textarea').bind("enterKey",function(e){
//    //do stuff here
// });
// $('textarea').keyup(function(e){
//     if(e.keyCode == 13)
//     {
//         $(this).trigger("enterKey");
//     }
// });

jQuery("body.google-analytics-loaded .track-with-analytics-events a").on( 'mousedown', function(e) {
  analyticsTrackInteraction(e.target,'Manually tracked area');
});
// To do: track livefilter
// input.filter[type="text"]').on("keyup", function() {

// log control+f and command+f
// base method via http://stackoverflow.com/a/6680403
var keydown = null;
if (jQuery('body').hasClass('google-analytics-loaded')) {
  jQuery(window).keydown(function(e) {
    // the user does ctrl+f action
    if ( ( e.keyCode == 70 && ( e.ctrlKey || e.metaKey ) ) ||
       ( e.keyCode == 191 ) ) {
      keydown = new Date().getTime();
    }
    return true;
  }).blur(function() {
    // and then browser window blurs, indicating shift to UI
    if ( keydown !== null ) {
      var delta = new Date().getTime() - keydown;
      if ( delta > 0 && delta < 1000 ) {
        ga('send', 'event', 'UI', 'UI Element / Keyboard', 'Browser in page search');
      }
      keydown = null;
    }
  });
}

// Foundation specific extensions of functionality
// -------------
(function($) {

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

    // Insert EMBL dropdown menu
    (function insertEMBLdropdown() {

      try {
        // remove any current dropdown
        if ((elem=document.getElementById('embl-dropdown')) !== null) {
          document.getElementById('embl-dropdown').remove();
        }
        // document.getElementById('embl-dropdown').innerHTML = '';

        var dropdownDiv = document.createElement("div");
        dropdownDiv.innerHTML = '<div id="embl-dropdown" class="dropdown-pane bottom" data-dropdown>' +
                  '<p>EMBL-EBI in Hinxton is one of five EMBL locations across europe.<br/> <a href="//www.ebi.ac.uk/about" class="small readmore">More about EMBL-EBI</a></p>' +
                  '<h6>Connect to another EMBL location</h6>' +
                  '<div class="small-collapse small-up-2 padding-bottom-large clearfix">' +
                    '<div class="column padding-bottom-medium">' +
                      '<a href="http://www.embl.fr/" class="">Grenoble</a>' +
                      '<div class="small">Structural Biology</div>' +
                    '</div>' +
                    '<div class="column padding-bottom-medium">' +
                      '<a href="http://www.embl-hamburg.de/" class="">Hamburg</a>' +
                      '<div class="small">Structural Biology</div>' +
                    '</div>' +
                    '<div class="column padding-bottom-medium">' +
                      '<a href="http://www.embl.de/" class="">Heidelberg</a>' +
                      '<div class="small">Main Laboratory</div>' +
                    '</div>' +
                    '<div class="column padding-bottom-medium">' +
                      '<a href="http://www.embl.it/" class="">Monterotondo</a>' +
                      '<div class="small">Mouse Biology</div>' +
                    '</div>' +
                  '</div>' +
                  '<p><a href="http://embl.org/" class="button readmore">Or learn more about EMBL</a></p>' +
                '</div>';
        document.getElementById("global-masthead").appendChild(dropdownDiv);

        // invoke the the foundation dropdown
        var options = {closeOnClick: true},
            dropdownEbiMenu = new Foundation.Dropdown($('#embl-dropdown'), options);
      }
      catch(err) {};

    })();

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
    $('table.responsive-table').each( function() {
      var columnsToAppend = $(this).find('th');
      for (var i = 0; i < columnsToAppend.length; i++) {
        if ($(columnsToAppend[i]).attr('class')) {
          var position = i + 1;
          $(this).find('td:nth-child('+position+')').addClass($(columnsToAppend[i]).attr('class'));
        }
      };
    });

    // Smooth scroll anchor links for jQuery users
    // -----------
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

    // Create a dynamic height for the menu bar when stuck
    // -----------
    var desiredStuckMenuHeight = $('#local-masthead .masthead').outerHeight();
    $("<style id='dynamic-stuck-height' type='text/css'> div#local-masthead.sticky.is-stuck{ margin-top: -" + desiredStuckMenuHeight + "px !important;} </style>").appendTo("body");

    // Clone the local menu into a mobile-only menu
    // -----------
    var localMenuClass = '#local-masthead .masthead > nav ul.dropdown.menu.float-left';
    // var localMenuClass = '#secondary-menu-links'; // temp for testing
    // $(localMenuClass).addClass('dropdown'); // temp for testing
    var localMenuWidthAvail = $('#local-masthead .masthead > nav').width();
    // var localMenuWidthTotal = $(localMenuClass).width();

    function localNavSpilloverMenu(changeDirection) {
      var localMenuWidthUsed = 0;
      var localMenuRightSideWidth = $('#local-masthead .masthead > nav ul.float-right.menu').width(); // width of any right-side nav, this could change on browser resize
      localMenuRightSideWidth = localMenuRightSideWidth + 5; // padding, eleminate NaN

      // Calculate how much space we've used
      $(localMenuClass+' > li').each( function() {
        localMenuWidthUsed = localMenuWidthUsed + $(this).width();
      });

      // account for any float-right menu
      localMenuWidthUsed = localMenuWidthUsed + localMenuRightSideWidth;

      // do we need to make space?
      if ( (changeDirection == 'init') || (changeDirection == 'decrease') ) {
        if (localMenuWidthUsed > localMenuWidthAvail) {
          // create dropdown if needed
          if ($(localMenuClass + ' li.extra-items-menu').length == 0) {
            $(localMenuClass).append('<li class="extra-items-menu"><a href="#">Also in this section</a><ul class="menu"></ul></li>');
            localMenuWidthUsed = localMenuWidthUsed + $(localMenuClass + ' li.extra-items-menu').width();
            // invoke foundation to create dropdown functionality when we add the menu
            var responsiveMenu = new Foundation.DropdownMenu($(localMenuClass));
          }

          // loop through each menu item in reverse, and slice off the first as it's the dropdown
          $($(localMenuClass+' > li').get().reverse().slice(1)).each( function() {
            if (localMenuWidthUsed > localMenuWidthAvail) { // do we need to hide more items?
              localMenuWidthUsed = localMenuWidthUsed - $(this).width();
              $(this).detach().prependTo(localMenuClass + ' li.extra-items-menu ul.menu');
            } // we could break when <= but this should be pretty fast
          });
        }
      }

      if (changeDirection == 'increase') {

        // does the dropdown exist?
        if ($(localMenuClass + ' li.extra-items-menu').length > 0) {

          // if the menu is shorter than full width, we can perhaps restore some menu items from the dropdown
          var spaceToWorkWith = localMenuWidthAvail - localMenuWidthUsed;

          // as the dropdown menu is the width of longest menu item, it's not practical to get the length of each,
          //   so if the longest item could fit, we'll restore an item
          while (spaceToWorkWith > $(localMenuClass+' li.extra-items-menu ul.menu li:first-child').width()) {
            spaceToWorkWith = spaceToWorkWith - $(localMenuClass+' li.extra-items-menu ul.menu li:first-child').width();
            $(localMenuClass+' li.extra-items-menu ul.menu li:first-child').detach().insertBefore(localMenuClass+' li.extra-items-menu');
            if ($(localMenuClass + ' li.extra-items-menu li').length == 1)  {
              // exit if just 1 item left in menu
              break;
            }
          }

          // if there's just one item left, perhaps we should delete the dropdown menu
          if ($(localMenuClass + ' li.extra-items-menu li').length == 1) {
            spaceToWorkWith = spaceToWorkWith + $(localMenuClass + ' li.extra-items-menu').width();
            if (spaceToWorkWith > $(localMenuClass+' li.extra-items-menu ul.menu li:first-child').width()) {
              // ok, we should move item up from dropdwon, this will leave us with 0 items and we'll delete in next if
              $(localMenuClass+' li.extra-items-menu ul.menu li:first-child').detach().insertBefore(localMenuClass+' li.extra-items-menu');
            }
          }

          if ($(localMenuClass + ' li.extra-items-menu li').length == 0) {
            // if the dropdown is empty, destroy the dropdown and remove it
            // $(localMenuClass).foundation('destroy');
            $(localMenuClass + ' li.extra-items-menu').remove();
          }
        }
      }

    }

    localNavSpilloverMenu('init');
    // re-calc menus on browser change, if it affect width of localMenuWidthAvail
    $(window).resize( function() {
      var widthChangeAmount = $('#local-masthead .masthead > nav').width() - localMenuWidthAvail;
      if (widthChangeAmount != 0) localMenuWidthAvail = $('#local-masthead .masthead > nav').width();
      // we look for changes of more than 1 to reduce jitter
      if (widthChangeAmount > 1)  localNavSpilloverMenu('increase');
      if (widthChangeAmount < -1) localNavSpilloverMenu('decrease');
    });

  }

}(jQuery));
