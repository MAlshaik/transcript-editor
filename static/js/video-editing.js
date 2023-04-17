console.log("-----start of video-editing.js-------")

async function makeRequest(url, data) {
    // Makes a generic request to the specified URL

    // Make request to backend:

    const promise = fetch(url, {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            "Accept": "application/json",
        },
        body: data,
    });

    var final_data = await promise.then(res => res.json());

    return final_data;
}

async function cutVideo(id, timestamps){
    console.trace();
    // Given a dictonary containing a timestamp list, cut the video in according to the timestamps.
    console.log(timestamps);

    loadingBar();

    let timestampJson = JSON.stringify(timestamps);
    let timestampList = timestamps["timestamps"];

    console.log(timestampList);
    console.log(id);

    var data = new FormData();
    data.append('id', id);
    data.append('cuts', timestampJson);
    
    console.log(timestampJson);

    var new_id = await makeRequest("/api/cuts/", data);
    id = new_id["id"];
    console.log(`c% current id: ${id}`, `color: red`)
    
    download_url = await getVideo(new_id["id"]);
    let url = download_url["url"];

    video = document.getElementById("video");
    source = document.getElementById("source");

    source.setAttribute("src", url);
    video.load();
      
    transcribeFile(id);
    generateTimeline();

    console.log(source);

    console.log("New ID");
    console.log(new_id);

    console.log("New download url");
    console.log(download_url);
    console.log(download_url["url"]);
}

async function getVideo(id){
    var data = new FormData();
    data.append('id', id);

    var retrieved_id = await makeRequest("/api/get/", data);
    return retrieved_id;
}

