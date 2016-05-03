// javascript: (function(e, a, g, h, f, c, b, d) {
//     if (!(f = e.jQuery) || g > f.fn.jquery || h(f)) {
//         c = a.createElement("script");
//         c.type = "text/javascript";
//         c.src = "https://ajax.googleapis.com/ajax/libs/jquery/" + g + "/jquery.min.js";
//         c.onload = c.onreadystatechange = function() {
//             if (!b && (!(d = this.readyState) || d == "loaded" || d == "complete")) {
//                 h((f = e.jQuery).noConflict(1), b = 1);
//                 // f(c).remove()
//             }
//         };
//         // a.documentElement.childNodes[0].appendChild(c)
//         document.getElementsByTagName("head")[0].appendChild(c);
//     }
// })(window, document, "1.8.0", function($, L) {

$(function () {

    var serviceUrl = 'writeclearly.openadvocate.org';


    window.OARC = {
      active: false,
      scope: undefined,
      original: undefined,
      processed: undefined,
      hovered: undefined,
      hoverTimer: undefined,
      mouseOutTimer: undefined,
      position: undefined,
      theme: undefined,
      footnotes: undefined,

      // Initializes the widget.
      // Parameters:
      //
      // - autoActivate: Specifies whether the glossary should be active on pageload.
      //   Possible values: true, false
      //
      // - position: Specifies the position of the on/off button.
      //   Possible values: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
      //
      // - theme: Specifies the theme to be userd.
      //   Possible values: 'default', 'neutral'
      //
      // - footnotes: If true, glossary items are also inserted as footnotes at the end of the content.
      //   Possible values: true, false
      init: function (autoActivate, position, theme, footnotes) {

        // Set defaults.
        if (typeof autoActivate === 'undefined') {
          autoActivate = true;
        }
        if (typeof position === 'undefined' || ['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(position) == -1) {
          position = 'bottom-right';
        }
        if (typeof theme === 'undefined' || ['default', 'neutral'].indexOf(theme) == -1) {
          theme = 'default';
        }
        if (typeof footnotes === 'undefined') {
          footnotes = false;
        }

        this.theme = theme;
        this.position = position;
        this.footnotes = footnotes;

        // Add css.
        var style = document.createElement("style");
        var themeStyles =(function () {/*
        #oarc-activate {
          -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
          -moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
          box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
          padding: 0;
          border:1px solid #563d7c;
          cursor:pointer;
          background-color: #563d7c;
          z-index:99999;
          position: fixed;
          color: #fff;
          font-family: arial,serif;
        }
        #oarc-activate.oarc-bottom-left {
          bottom: 82px;
          left: 0px;
        }
        #oarc-activate.oarc-bottom-right {
          bottom: 82px;
          right: 0px;
        }
        #oarc-activate.oarc-top-right {
          top: 82px;
          right: 0px;
        }
        #oarc-activate.oarc-top-left {
          top: 82px;
          left: 0px;
        }
        #oarc-popup-container {
          font-family: arial;
          -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
          -moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
          box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
          position: absolute;
          max-width:200px;
          padding: 10px;
          z-index:99999;
          background-color: #563d7c;
          color: #fff;
          border:1px solid  #563d7c;
          border-radius: 3px;
          font-family: arial,serif;
          font-size: 14px;
          line-height: 18px;
        }
        #oarc-popup-container a{
          font-weight: bold;
          color: #fff;
          text-decoration: none;
        }
        #oarc-popup-container a:hover{
        }
        .oarc-option-info {
          width: 46px;
          height: 46px;
        }
        #oarc-option-popup,
        #oarc-info-popup{
          font-size: 16px;
          line-height: 1.4em;
          background: none repeat scroll 0 0 #563d7c;
          -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
          -moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
          box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
          border-radius: 5px;
          font-size: 16px;
          padding: 4px 0 4px 17px;
          position: absolute;
          top: 6px;
          width: 290px;
          visibility:hidden;
          opacity:0;
          transition:visibility 0s linear 0.5s,opacity 0.5s linear;
        }
        #oarc-option-popup{
          top: 50px;
          transition:visibility 0s linear 0.2s,opacity 0.2s linear;
        }
        .oarc-option-info:hover #oarc-info-popup {
          visibility:visible;
          opacity:1;
          transition-delay:0s;
        }
        #oarc-option-glossary.activate #oarc-option-popup {
          visibility:visible;
          opacity:1;
          transition-delay:0s;
        }
        #oarc-option-popup.oarc-option-popup-top-right,
        #oarc-option-popup.oarc-option-popup-bottom-right,
        #oarc-info-popup.oarc-info-popup-top-right,
        #oarc-info-popup.oarc-info-popup-bottom-right{
          right: 56px;
        }
        #oarc-option-popup.oarc-option-popup-top-left,
        #oarc-option-popup.oarc-option-popup-bottom-left,
        #oarc-info-popup.oarc-info-popup-top-left,
        #oarc-info-popup.oarc-info-popup-bottom-left{
          left: 56px;
        }
        #oarc-option-arrow-top-right,
        #oarc-option-arrow-bottom-right,
        #oarc-info-arrow-top-right,
        #oarc-info-arrow-bottom-right{
          width: 0;
          height: 0;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          right: -8px;
          top: 5px;
          border-left: 10px solid #563d7c;
          position: absolute;
        }
        #oarc-option-arrow-top-left,
        #oarc-option-arrow-bottom-left,
        #oarc-info-arrow-top-left,
        #oarc-info-arrow-bottom-left{
          width: 0;
          height: 0;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-right: 10px solid #563d7c;
          left: -8px;
          top: 5px;
          position: absolute;
        }

        #oarc-option-glossary {
          width: 46px;
          height: 46px;
          display: block;
          text-align: center;
          padding-top: 10px;
        }
        .oarc-option{
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 9px;
          padding: 4px;
        }
        .oarc-option label{
          padding-right: 8px;
          margin: 0;
        }
        .oarc-vote-holder {
          padding-top:8px;
        }
        a.oarc-vote-option{
          min-width: 30px;
          display: inline-block;
          text-align: center;
          text-decoration: none;
        }
        a.oarc-vote-option:hover{
          background: rgba(255,255,255,0.2);
          text-decoration: none;
        }
        .oarc-arrow {
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 10px solid #5e4485;
          top: -10px;
          position: absolute;
        }

        .oarc-word {
           position:relative;
           border-bottom: 2px dashed #5e4485;
           cursor:pointer;
        }
        .oarc-word.hovered {
          background-color: #d0bbf0;
        }
        .oarc-word .oarc-marker {
          display:none;
        }
        label.oarc-labl {
          display: inline;
        }
        .oarc-regular-checkbox {
          display: none;
        }
        .oarc-word{
          border-bottom: 2px dashed #563d7c;
        }
        .oarc-regular-checkbox + label.oarc-labl {
          background-color: #fafafa;
          border: 1px solid #cacece;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05), inset 0px -15px 10px -12px rgba(0,0,0,0.05);
          padding: 9px;
          border-radius: 3px;
          display: inline-block;
          position: relative;
        }
        .oarc-regular-checkbox + label.oarc-labl:active, .oarc-regular-checkbox:checked + label.oarc-labl:active {
          box-shadow: 0 1px 2px rgba(0,0,0,0.05), inset 0px 1px 3px rgba(0,0,0,0.1);
        }
        .oarc-regular-checkbox:checked + label.oarc-labl {
          background-color: #e9ecee;
          border: 1px solid #adb8c0;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05), inset 0px -15px 10px -12px rgba(0,0,0,0.05), inset 15px 10px -12px rgba(255,255,255,0.1);
          color: #99a1a7;
        }
        .oarc-regular-checkbox:checked + label.oarc-labl:after {
          content: '\2713';
          font-size: 14px;
          position: absolute;
          top: 0px;
          left: 3px;
          color: #563d7c;
        }
        */}).toString().match(/[^]*\/\*([^]*)\*\//)[1];

        if (this.theme == 'default') {
          // 'Default' theme CSS.
          var themeStylesExtra =(function () {/*

          */}).toString().match(/[^]*\/\*([^]*)\*\//)[1];
        }
        else if (this.theme == 'neutral') {
          // 'Neutral' theme CSS.
          var themeStylesExtra =(function () {/*
          #oarc-activate {
            border:1px solid #efefe5;
            background-color: #efefe5;
          }
          #oarc-popup-container {
            background-color: #efefe5;
            border:1px solid  #efefe5;
            color: #563d7c;
          }
          #oarc-popup-container a{
            color: #563d7c;
          }
          .oarc-arrow {
            border-bottom: 10px solid #efefe5;
          }
          .oarc-option{
            border: 1px solid #563d7c;
          }
          .oarc-word {
            position:relative;
            border-bottom: 2px dashed #c1c1bc;
          }
          .oarc-word.hovered {
            background-color: #efefe5;
          }
          .oarc-regular-checkbox:checked + label.oarc-labl:after {
            color: #563d7c;
          }
          #oarc-option-arrow-top-right,
          #oarc-option-arrow-bottom-right,
          #oarc-info-arrow-top-right,
          #oarc-info-arrow-bottom-right{
            border-left: 10px solid #efefe5;
            border-right: none;
          }
          #oarc-option-arrow-top-left,
          #oarc-option-arrow-bottom-left,
          #oarc-info-arrow-top-left,
          #oarc-info-arrow-bottom-left{
            border-right: 10px solid #efefe5;
            border-left: none;
          }
          #oarc-option-popup,
          #oarc-info-popup{
            background: none repeat scroll 0 0 #efefe5;
            color: #563d7c;
          }
        */}).toString().match(/[^]*\/\*([^]*)\*\//)[1];
        }

        style.appendChild(document.createTextNode(themeStyles));
        style.appendChild(document.createTextNode(themeStylesExtra));

        document.head.appendChild(style);

        // Add activate button, reset click handler.

        $('<div id="oarc-activate" class="oarc-' + this.position + '"><div class="oarc-option-info"><div id="oarc-info-popup" class="oarc-info-popup-' + this.position + '"><div id="oarc-info-arrow-' + this.position + '"></div>Show meaning of legal words</div></div><div id="oarc-option-glossary"><div id="oarc-option-popup" class="oarc-option-popup-' + this.position + '"><div id="oarc-option-arrow-' + this.position + '"></div><span class="oarc-oarc-on-off"></span></div><input type="checkbox" id="oarc-checkbox-1-1" class="oarc-regular-checkbox" checked /><label class="oarc-labl" for="oarc-checkbox-1-1"></label></div></div>').prependTo('body');
        if (this.theme == 'default') {
          $('#oarc-activate').css("background",'url("//'+serviceUrl+'/oarc/img/info.png") #563d7c center 10px no-repeat');
        }else if (this.theme == 'neutral') {
          $('#oarc-activate').css("background",'url("//'+serviceUrl+'/oarc/img/info-theme2.png") #efefe5 center 10px no-repeat');
        }

        $('#oarc-activate #oarc-option-glossary #oarc-checkbox-1-1').off('click', this.activateClicked);
        $('#oarc-activate #oarc-option-glossary #oarc-checkbox-1-1').on('click', this, this.activateClicked);

        // Try to determine content.
        if ($('.openadvocate-content').length > 0) {
          // OA content.
          this.scope = $('.openadvocate-content');
        }
        else if ($('.page-node .node').length > 0) {
          // Drupal content (full node page).
          this.scope = $('.page-node .node');
        }
        else if ($('.page-node .field-name-body').length > 0) {
          // Drupal content (node body on non-node page).
          this.scope = $('.page-node .field-name-body');
        }
        else if ($('.single-post .post').length > 0) {
          // Wordpress content.
          this.scope = $('.single-post .post');
        }
        else {
          // Grab the whole body.
          this.scope = $('body');
        }

        if (this.scope.length > 1) {
          // Content will be replaced, so there should be only one element in scope.
          this.scope.first();
        }

        // Check for potential problems and log.
        if (this.scope.find('script').length || this.scope.find('object').length || this.scope.find('embed').length) {
          console.log('ReadClearly: The parsed content contains javascript or embedded objects. This may cause incorrect behavior.');
        }

        this.original = this.scope.html();
        var self = this;

        // Send HTML to server for processing.
        $.ajax({
          type: 'POST',
          url: '//' + serviceUrl + '/oarc/service.php',
          // data: {content: this.original},
          data: JSON.stringify({content: this.original}),
          processData: false,
          contentType: 'application/json',
          success: function (data, textStatus, jqXHR) {
            self.processed = data;

            if (autoActivate) {
              self.activate();
            }
            else {
              // Footnotes are displayed regardless.
              if (self.footnotes) {
                self.addFootnotes();
              }
            }

          },
          error: function (jqXHR, textStatus, errorThrown) {
              console.log('ReadClearly error: ' + errorThrown);
          }

        });

      },

      cleanupContent: function () {
        var totalCounts = {};

        this.scope.find('p').each(function (index) {
          var paragraphWords = [];

          $(this).find('.oarc-word').each(function (index) {
            var word = $(this).text();
            word = word.toLowerCase();

            if (typeof totalCounts[word] == 'undefined') {
              totalCounts[word] = 0;
            }

            if (paragraphWords.indexOf(word) == -1 && totalCounts[word] < 3) {
              paragraphWords.push(word);
              totalCounts[word]++;
            }
            else {
              // Remove duplicates in the paragraph.
              $(this).find('.oarc-marker').remove();
              $(this).replaceWith(this.childNodes);
            }

          });

        });
      },

      activate: function () {
        if (typeof this.processed == 'undefined') {
          console.log('ReadClearly content not available.');
          return;
        }

        this.active = true;

        this.scope.html(this.processed);
        this.cleanupContent();

        var self = this;

        $('#oarc-activate').find('#oarc-checkbox-1-1').attr('checked', 'checked');
        if (this.theme == 'default') {
          $('#oarc-activate').css("background",'url("//'+serviceUrl+'/oarc/img/info.png") #563d7c center 10px no-repeat');
        }else if (this.theme == 'neutral') {
          $('#oarc-activate').css("background",'url("//'+serviceUrl+'/oarc/img/info-theme2.png") #efefe5 center 10px no-repeat');
        }

        this.scope.find('.oarc-word').hover(
          function () {
            self.entryHover($(this));
          },
          function () {
            self.mouseOut($(this));
        });

        if (self.footnotes) {
          this.addFootnotes();
        }

        $("#oarc-option-glossary").find('span.oarc-oarc-on-off').text("ON (legal words underlined)");
        $("#oarc-option-glossary").addClass('activate');
        setTimeout(function() {
          $("#oarc-option-glossary").removeClass('activate');
        }, 500);

        // If the the full body has been processed,
        // the activate button is re-inserted upon activate so the click
        // handler needs to be reactiveated.
        $('#oarc-activate #oarc-option-glossary #oarc-checkbox-1-1').off('click', this.activateClicked);
        $('#oarc-activate #oarc-option-glossary #oarc-checkbox-1-1').on('click', this, this.activateClicked);
      },

      deactivate: function () {
        this.active = false;
        // Put the original content back.
        this.scope.html(this.original);

        $('#oarc-activate').find('#oarc-checkbox-1-1').removeAttr("checked");

        if (this.theme == 'default') {
          $('#oarc-activate').css("background",'url("//'+serviceUrl+'/oarc/img/info.png") #563d7c center 10px no-repeat');
        }else if (this.theme == 'neutral') {
          $('#oarc-activate').css("background",'url("//'+serviceUrl+'/oarc/img/info-theme2.png") #efefe5 center 10px no-repeat');
        }

        $("#oarc-option-glossary").find('span.oarc-oarc-on-off').text("OFF");
        $("#oarc-option-glossary").addClass('activate')
        setTimeout(function(){
          $("#oarc-option-glossary").removeClass('activate');
        }, 500);

        $('#oarc-activate #oarc-option-glossary #oarc-checkbox-1-1').off('click', this.activateClicked);
        $('#oarc-activate #oarc-option-glossary #oarc-checkbox-1-1').on('click', this, this.activateClicked);

        // Footnotes are now removed. Readd them.
        if (this.footnotes) {
          this.addFootnotes();
        }

      },

      addFootnotes: function () {
        var addedWords = [];
        var items = [];

        $($.parseHTML(this.processed)).find('.oarc-word').each(function (index) {
          var word = $(this).text();
          var sort = word.toLowerCase();

          if (addedWords.indexOf(sort) == -1) {
            addedWords.push(sort);

            items.push({
              'sort': sort,
              'word': word,
              'glossary': $(this).attr('data-glossary')
            });
          }

        });

        items.sort(function(a,b) {
          if (a.sort < b.sort) {
            return -1;
          }
          else if (a.sort > b.sort) {
            return 1;
          }
          return 0;
        });


        var footnotes = '';
        items.forEach(function(item) {
          footnotes = footnotes + '<dt>' + item.word + '</dt><dd>' + item.glossary + '</dd>';
        });

        footnotes = '<div id="oarc-footnotes-header">Glossary</div><dl id="oarc-footnotes">' + footnotes + '<dl>';

        this.scope.append(footnotes);
      },

      activateClicked: function (e) {
        e.stopPropagation();
        var self = e.data;

        if (self.active) {
          self.deactivate();
        }
        else {
          self.activate();
        }
      },

      entryHover: function (word) {

        var glossary = word.attr('data-glossary');
        var voted = word.attr('data-voted');
        var wordOffset = word.offset();

        this.hideEntry(word);

        this.hovered = word;
        this.hoverTimer = setTimeout(this.hoverTimerTick, 3000);

        // Inject popup window for glossary entry.
        var voting = '';
        if (!voted) {
          voting = '<div class="oarc-vote"> Was this hint helpful? <div class="oarc-vote-holder"><a class="oarc-vote-option oarc-vote-yes oarc-option" href="#" data-vote="yes">Yes</a> <a class="oarc-vote-option oarc-vote-no oarc-option" href="#" data-vote="no">No</a> </div></div>';
        }

        var glossaryHtml = '<div id="oarc-popup-container"><div class="oarc-arrow"></div><div class="oarc-popup-content"></div> <br>' + voting + '</div>';

        $(glossaryHtml).appendTo('body').hide();
        $('#oarc-popup-container').css('left', wordOffset.left);
        $('#oarc-popup-container').css('top', wordOffset.top +  word.height() + 12 );
        $('#oarc-popup-container .oarc-popup-content').html(glossary);
        $('#oarc-popup-container').fadeIn('fast');

        $(word).addClass('hovered');

        var self = this;
        $('#oarc-popup-container').hover(
          function () {
            self.popupHover($(this));
          },
          function () {
            self.mouseOut();
        });

        $('#oarc-popup-container .oarc-vote a').click(
          function (e) {
            e.preventDefault();
            self.voteClick($(this));
        });
      },

      hoverTimerTick: function () {

        if (!window.OARC.hovered) {
          return;
        }

        $.ajax({
          type: 'POST',
          url: '//' + serviceUrl + '/oarc/service.php',
          data: JSON.stringify({hovered: window.OARC.hovered.text()}),
          processData: false,
          contentType: 'application/json',
          success: function (data, textStatus, jqXHR) {
          },
          error: function (jqXHR, textStatus, errorThrown) {
              console.log('ReadClearly error: ' + errorThrown);
          }

        });
      },

      voteClick: function(item) {
        var value = item.attr('data-vote');

        if (!this.hovered) {
          return;
        }

        // Remove vote links.
        item.closest('.oarc-vote').fadeOut('fast', function () {
          $(this).css('visibility', 'hidden').css('display', 'block');
        });

        // Mark entry so that the vote link does not reappear.
        this.hovered.attr('data-voted', '1');

        $.ajax({
          type: 'POST',
          url: '//' + serviceUrl + '/oarc/service.php',
          data: JSON.stringify({voted: this.hovered.text(), value: value}),
          processData: false,
          contentType: 'application/json',
          success: function (data, textStatus, jqXHR) {
          },
          error: function (jqXHR, textStatus, errorThrown) {
              console.log('ReadClearly error: ' + errorThrown);
          }

        });
      },

      popupHover: function () {
        // Clear timer to keep the popup around.
        if (this.mouseOutTimer) {
          clearTimeout(this.mouseOutTimer);
        }
      },

      hideEntry: function () {

        if (this.mouseOutTimer) {
          clearTimeout(this.mouseOutTimer);
        }
        if (this.hoverTimer) {
          clearTimeout(this.hoverTimer);
        }

        this.hovered = undefined;
        $('#oarc-popup-container').remove();

        $('.oarc-word').removeClass('hovered');

      },

      mouseOutTimerTick: function() {
        window.OARC.hideEntry();
      },

      mouseOut: function () {

        if (this.mouseOutTimer) {
          clearTimeout(this.mouseOutTimer);
        }
        this.mouseOutTimer = setTimeout(this.mouseOutTimerTick, 1000);
      }

    }; // window.OARC

    if (typeof window.OARCAutoload !== 'undefined') {
      window.OARC.init();
    }
});


}); // jQuery loader.