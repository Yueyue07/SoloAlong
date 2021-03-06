$(() => {
  $.get('/../template_userinfo.html', (data) => {
    var template = Handlebars.compile(data);
    $.ajax({
      contentType: 'application/json',
      headers: {
        token: $.cookie('token')
      },
      dataType: 'json',
      processData: false,
      type: 'GET',
      url: '/profile',
      success: function(theta) {
        var userinfo = theta.userinfo[0];
        var user = template(userinfo);
        $('#userinfo').append(user);
      },
      error: function(data) { console.log(data); }
    });
  });
  $.get('/../template_chords.html', (data) => {
    var template = Handlebars.compile(data);
    var selected;
    $.ajax({
      contentType: 'application/json',
      headers: {
        token: $.cookie('token')
      },
      dataType: 'json',
      success: function(theta) {
        var chord = theta.chord;
        for (var i = 0; i < chord.length; i += 1) {
          var chordm = template(chord[i]);
          $('#chords').append(chordm);
        }
        $('#chords').children().first().attr('class', 'item active');

       
        $('#chords img').click(function(e){
          selected = $(e.target).attr('class');
          document.getElementById('load').disabled = false; 
          console.log(selected);
        });

        // $('button').click(function(){
        //   //ajax to template
        //   console.log(selected);
        //   var _id = selected;
        // });

        $('button').click(function(){
          //ajax to template
          var audio;
          var playlist;
          var tracks;
          var current;
          var bpmTime = 2000;
          var doItAgain;
          $(() => {
            $.get('/../template_player.html', (data) => {
              var template = Handlebars.compile(data);
              $.ajax({
                contentType: 'application/json',
                headers: {
                  token: $.cookie('token'),
                  chordId: selected
                },
                dataType: 'json',
                processData: false,
                type: 'GET',
                url: '/player2',
                success: function(theta) {
                  console.log(theta);
                  var html = template(theta);
                  //stop!
                  window.clearTimeout(doItAgain);
                  //empty!
                  $('#player').empty();
                  //add again
                  $('#player').append(html);

                  var audio;
                  var playlist;
                  var tracks;
                  var current;
                  var bpmTime = 2000;
                  var doItAgain;

                  init();
                  function init(){
                    current = 0;
                    audio = $('#audio');
                    playlist = $('#playlist');
                    tracks = playlist.find('li a');
                    audio[0].play();
                    playlist.find('a').click(function(e){
                        e.preventDefault();
                        link = $(this);
                        current = link.parent().index();
                        run(link, audio[0]);
                    });
                    doItAgain = window.setTimeout(nextSample, bpmTime);
                  }
                  function run(link, player){
                    player.src = link.attr('href');
                    par = link.parent();
                    par.addClass('active').siblings().removeClass('active');
                    audio[0].play();
                  }
                  function nextSample(){
                    current = (current + 1) % tracks.length;
                    link = playlist.find('a')[current];   
                    run($(link),audio[0]);
                    doItAgain = window.setTimeout(nextSample, bpmTime);
                  }

                  $('#bpm').change(() => {
                    window.clearTimeout(doItAgain);
                    bpmTime = 60000/Number($('#bpm').val()) * 4;
                    nextSample();
                  });

                  $('#pause').on('click', function(){
                    window.clearTimeout(doItAgain);
                  });

                  $('#play').on('click', function(){
                    nextSample();
                });

                },
                error: function(data) { console.log(data); }
              });
            });
          });

        });

      },
      error: function(data) { console.log(data); },
      processData: false,
      type: 'GET',
      url: '/profile'
    });
  });

  $('.button').click(function() {
      window.location.href = '/chordsInKey';
      return false;
  });

});
