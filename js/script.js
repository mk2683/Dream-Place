
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    var street, city, address, streetViewUrl;

    street = $("#street").val();
    city = $("#city").val();
    address = street + ", " + city
    $greeting.text("So, you want to live at " + address + "?");

    streetViewUrl = "http://maps.googleapis.com/maps/api/streetview?size=1366x768&location=" + address;
    $body.append('<img class="bgimg" src="' + streetViewUrl + '">');
    console.log(street + "--" + city + "--" + streetViewUrl);

    // NYT Articles

    var nytUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + city + "&sort=newest&api-key=7ad41c4de7fa4ea79e789245bcf725c2" ;

    $.getJSON(nytUrl, function(result){
        console.log(result);
        $nytHeaderElem.text("NewYork times articles about " + city);
        var articles = result.response.docs;
        for (var i = 0; i < articles.length; i++) {
            $nytElem.append('<li class="article">' +
                '<a href="' + articles[i].web_url + '">' + articles[i].headline.main + '</a>' +
                '<p>' + articles[i].snippet + '</p>' +
                '</li>' );
        }
    })
    .fail(function(){
        $nytElem.text("NewYork times articles about " + city ).append("<em> not found</em>");
    })

    // Wikipedia Page

    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + city + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources!!");
    }, 4000)

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        //jsonp: "callback",
        success: function( response ){
            console.log(response);
            var article;
            for (var j = 1; j < response.length -1; j++) {
                article = response[j];
                for (var i = 0; i < article.length; i++) {
                    articleStr = article[i];
                    var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                    $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
                }
            }
            clearTimeout(wikiRequestTimeout);
        }
    });
    return false;
};

$('#form-container').submit(loadData);
