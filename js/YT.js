$(function(){
  $("#startDate").datepicker();
});

$(function(){
  $("#endDate").datepicker();
});

function init(){
  gapi.client.setApiKey('YOUR API KEY HERE!!');
  gapi.client.load("youtube", "v3", function() {
  });
}

$(function(){
  $("form").on("submit", function(e){
    e.preventDefault();
    var defaultTime = "T00:00:00Z";
    var temps = $('#startDate').datepicker('getDate');
    var tempe = $('#endDate').datepicker('getDate');
    var startDateTemp = $.datepicker.formatDate('yy-mm-dd', temps);
    var endDateTemp = $.datepicker.formatDate('yy-mm-dd', tempe);
    var startDate = startDateTemp.concat(defaultTime);
    var endDate = endDateTemp.concat(defaultTime);
    var channelId = $("#channelName").val();
    var request = gapi.client.youtube.channels.list({
      part: "snippet",
      forUsername: channelId
    });
    request.execute(function(response) {
      if(response.items.length < 1){
        console.log("That Channel does not exisit.");
      }else{
        var videoRequeset = gapi.client.youtube.search.list({
          part: "snippet",
          channelId: response.items[0].id,
          type: "video",
          maxResults: 50,
          order: "date",
          publishedAfter: encodeURI(startDate),
          publishedBefore: encodeURI(endDate)
        });
        videoRequeset.execute(function(response){
          for(var i =0; i < response.items.length; response.items[i++]){
            $('#results').append('<iframe width="420" height="315" src="http://www.youtube.com/embed/'+ response.items[i].id.videoId +'"></iframe>');
          }
        });
      }
    }, function(reason) {
      console.log('Error: ' + reason.result.error.message);
    });
  });
});
