$(function(){
  $("#startDate").datepicker();
});

$(function(){
  $("#endDate").datepicker();
});

function init(){
  gapi.client.setApiKey("YOUR_API_KEY");
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
    console.log(channelId);
    console.log(startDate);
    console.log(endDate);
    var request = gapi.client.youtube.channels.list({
      part: "snippet",
      forUsername: channelId
    });
    request.execute(function(response) {
      console.log(response);
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
          console.log(response);
          for(var i =0; i < response.items.length; response.items[i++]){
            $('#results').append('<tr><td>' + response.items[i].snippet.title + '</td></tr>');
          }
        });
      }
    }, function(reason) {
      console.log('Error: ' + reason.result.error.message);
    });
  });
});
