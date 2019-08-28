const fs = require("fs");
const rp = require("request-promise");
const xmlbuilder = require("xmlbuilder");

function getAccessToken(subscriptionKey) {
  let options = {
    method: "POST",
    uri: "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey
    }
  };
  console.log(options);
  return rp(options);
}

// Make sure to update User-Agent with the name of your resource.
// You can also change the voice and output formats. See:
// https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#text-to-speech
function textToSpeech(accessToken, text) {
  // Create the SSML request.
  let xml_body = xmlbuilder
    .create("speak")
    .att("version", "1.0")
    .att("xml:lang", "en-us")
    .ele("voice")
    .att("xml:lang", "en-us")
    .att(
      "name",
      "Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)"
    )
    .txt(text)
    .end();
  // Convert the XML into a string to send in the TTS request.
  let body = xml_body.toString();

  let options = {
    method: "POST",
    baseUrl: "https://westus.tts.speech.microsoft.com/",
    url: "cognitiveservices/v1",
    headers: {
      Authorization: "Bearer " + accessToken,
      "cache-control": "no-cache",
      "User-Agent": "mycognitivebundle",
      "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm",
      "Content-Type": "application/ssml+xml"
    },
    body: body
  };

  let request = rp(options).on("response", response => {
    if (response.statusCode === 200) {
      request.pipe(fs.createWriteStream("TTSOutput.wav"));
      console.log("\nYour file is ready.\n");
    }
  });
  return request;
}

module.exports = {
  getAccessToken,
  textToSpeech
};
